using FinWiseNest.Data.Messaging;
using Microsoft.EntityFrameworkCore.Metadata;
using RabbitMQ.Client;
using System.Collections.Concurrent;
using System.Text;
using System.Text.Json;

namespace TransactionService.Messaging;

public class RabbitMQMessagingService : IMessageService
{
    private readonly IConnection _connection;

    public RabbitMQMessagingService(IConnection connection)
    {
        _connection = connection;
    }

    public async Task PublishMessageAsync<T>(string exchangeName, T message)
    {
        // Use the new asynchronous method to create a channel.
        // `await using` ensures the channel is properly and asynchronously disposed.
        await using var channel = await _connection.CreateChannelAsync();

        // We declare the exchange to ensure it exists.
        // It's an idempotent operation; it does nothing if the exchange already exists.
        // The channel methods are now extension methods and are awaitable.
        await channel.ExchangeDeclareAsync(
            exchange: exchangeName,
            type: ExchangeType.Fanout,
            durable: true);

        var messageBody = JsonSerializer.Serialize(message);
        var body = Encoding.UTF8.GetBytes(messageBody);

        // Use the asynchronous publish method.
        await channel.BasicPublishAsync(
            exchange: exchangeName,
            routingKey: "", // routingKey is ignored for fanout exchanges
            body: body);

        Console.WriteLine($"--> Published message to RabbitMQ Exchange: {exchangeName}");
    }
}
