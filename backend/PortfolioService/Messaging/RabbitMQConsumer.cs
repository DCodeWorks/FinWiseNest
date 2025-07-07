using FinWiseNest.Data;
using FinWiseNest.Data.Entities;
using Microsoft.EntityFrameworkCore;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System.Text;
using System.Text.Json;

namespace PortfolioService.Messaging;

public class RabbitMQConsumer : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<RabbitMQConsumer> _logger;
    private IConnection? _connection;
    private IChannel? _channel;
    private const string TopicName = "transaction-events";

    public RabbitMQConsumer(
        IConfiguration configuration,
        IServiceProvider serviceProvider,
        ILogger<RabbitMQConsumer> logger,IConnection connection)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
        _connection = connection;
    }

    public override async Task StartAsync(CancellationToken cancellationToken)
    {
        _logger.LogInformation("RabbitMQ Consumer is starting...");

        try
        {
            _channel = await _connection!.CreateChannelAsync();

            // Declare the same exchange the publisher uses
            await _channel.ExchangeDeclareAsync(
                exchange: TopicName,
                type: ExchangeType.Fanout,
                durable: true,
                autoDelete: false,
                arguments: null,
                cancellationToken: cancellationToken);

            _logger.LogInformation("RabbitMQ Consumer started successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error starting RabbitMQ Consumer");
            throw;
        }

        await base.StartAsync(cancellationToken);
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        if (_channel == null)
        {
            _logger.LogError("Channel is not initialized");
            return;
        }

        try
        {
            // Declare a queue for this service. A non-durable, exclusive, auto-delete queue
            // is perfect for a pub/sub fanout scenario where each consumer instance needs all messages.
            var queueDeclareResult = await _channel.QueueDeclareAsync(
                queue: "", // Let RabbitMQ generate a unique queue name
                durable: false,
                exclusive: true,
                autoDelete: true,
                arguments: null,
                cancellationToken: stoppingToken);

            var queueName = queueDeclareResult.QueueName;

            await _channel.QueueBindAsync(
                queue: queueName,
                exchange: TopicName,
                routingKey: "",
                arguments: null,
                cancellationToken: stoppingToken);

            var consumer = new AsyncEventingBasicConsumer(_channel);

            consumer.ReceivedAsync += async (model, ea) =>
            {
                try
                {
                    var body = ea.Body.ToArray();
                    var message = Encoding.UTF8.GetString(body);
                    var transactionEvent = JsonSerializer.Deserialize<TransactionCreatedEvent>(message);

                    if (transactionEvent != null)
                    {
                        _logger.LogInformation("Received TransactionCreatedEvent for Ticker: {Ticker}", transactionEvent.Ticker);
                        await ProcessEvent(transactionEvent, stoppingToken);
                    }
                    else
                    {
                        _logger.LogWarning("Failed to deserialize TransactionCreatedEvent from message: {Message}", message);
                    }

                    await _channel.BasicAckAsync(ea.DeliveryTag, multiple: false, cancellationToken: stoppingToken);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error processing message");

                    try
                    {
                        // Reject the message and don't requeue it to avoid infinite loops
                        await _channel.BasicNackAsync(
                            deliveryTag: ea.DeliveryTag,
                            multiple: false,
                            requeue: false,
                            cancellationToken: stoppingToken);
                    }
                    catch (Exception nackEx)
                    {
                        _logger.LogError(nackEx, "Error rejecting message");
                    }
                }
            };

            consumer.ShutdownAsync += async (model, ea) =>
            {
                _logger.LogInformation("Consumer shutdown: {ReplyText}", ea.ReplyText);
                await Task.CompletedTask;
            };

            consumer.RegisteredAsync += async (model, ea) =>
            {
                _logger.LogInformation("Consumer registered");
                await Task.CompletedTask;
            };

            consumer.UnregisteredAsync += async (model, ea) =>
            {
                _logger.LogInformation("Consumer unregistered");
                await Task.CompletedTask;
            };


            await _channel.BasicConsumeAsync(
                queue: queueName,
                autoAck: false,
                consumer: consumer,
                cancellationToken: stoppingToken);

            _logger.LogInformation("Consumer started, waiting for messages...");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in ExecuteAsync");
            throw;
        }
    }

    private async Task ProcessEvent(TransactionCreatedEvent transactionEvent, CancellationToken cancellationToken)
    {
        // CRITICAL: We must create a new scope to resolve scoped services like AppDbContext.
        // A BackgroundService is a singleton, so we cannot inject AppDbContext directly.
        using var scope = _serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        try
        {
            var holding = await context.Holdings
                .FirstOrDefaultAsync(h => h.Ticker == transactionEvent.Ticker, cancellationToken);

            if (holding == null)
            {
                // Create a new holding if it doesn't exist
                holding = new Holding
                {
                    Ticker = transactionEvent.Ticker,
                    Name = $"New Holding for {transactionEvent.Ticker}", // We might need a better way to get the name later
                    Quantity = transactionEvent.Quantity
                    // Set other initial values...
                };
                await context.Holdings.AddAsync(holding, cancellationToken);
            }
            else
            {
                // Update existing holding
                if (transactionEvent.Type == TransactionType.Buy)
                {
                    holding.Quantity += transactionEvent.Quantity;
                }
                else if (transactionEvent.Type == TransactionType.Sell)
                {
                    holding.Quantity -= transactionEvent.Quantity;

                    // Optional: Remove holding if quantity becomes 0 or negative
                    if (holding.Quantity <= 0)
                    {
                        _logger.LogInformation("Removing holding for {Ticker} as quantity is {Quantity}",
                            holding.Ticker, holding.Quantity);
                        context.Holdings.Remove(holding);
                    }
                }
                // Add more complex logic for average cost, etc., later
            }

            await context.SaveChangesAsync(cancellationToken);
            _logger.LogInformation("Portfolio updated for Ticker: {Ticker}", transactionEvent.Ticker);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing TransactionCreatedEvent for Ticker: {Ticker}", transactionEvent.Ticker);
            throw;
        }
    }

    public override async Task StopAsync(CancellationToken cancellationToken)
    {
        _logger.LogInformation("RabbitMQ Consumer is stopping...");

        try
        {
            if (_channel != null)
            {
                await _channel.CloseAsync(cancellationToken);
            }

            if (_connection != null)
            {
                await _connection.CloseAsync(cancellationToken);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error stopping RabbitMQ Consumer");
        }

        await base.StopAsync(cancellationToken);

        _logger.LogInformation("RabbitMQ Consumer stopped");
    }

    public override void Dispose()
    {
        _channel?.Dispose();
        _connection?.Dispose();
        base.Dispose();
    }
}