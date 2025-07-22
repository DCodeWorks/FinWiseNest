using FinWiseNest.Data;
using FinWiseNest.Data.Messaging;
using Microsoft.EntityFrameworkCore;
using PortfolioService.Hubs;
using PortfolioService.Messaging;
using RabbitMQ.Client;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddHttpClient("MarketDataApiClient", client =>
{
    string marketDataServiceBaseUrl = builder.Configuration["MarketDataService:BaseUrl"]!;
    if (string.IsNullOrEmpty(marketDataServiceBaseUrl))
    {
        throw new InvalidOperationException("MarketDataService:BaseUrl is not configured.");
    }
    client.BaseAddress = new Uri(marketDataServiceBaseUrl);
});

builder.Services.AddSignalR();

if (builder.Environment.IsDevelopment())
{
    var rabbitMqConnectionString = builder.Configuration["RabbitMQ:ConnectionString"];
    if (string.IsNullOrEmpty(rabbitMqConnectionString))
    {
        throw new InvalidOperationException("RabbitMQ:ConnectionString is not configured.");
    }

    var factory = new ConnectionFactory()
    {
        Uri = new Uri(rabbitMqConnectionString)
    };

    Console.WriteLine("--> Attempting to connect to RabbitMQ...");
    IConnection rabbitMqConnection = await factory.CreateConnectionAsync();
    Console.WriteLine("--> Connected to RabbitMQ successfully.");

    builder.Services.AddSingleton(rabbitMqConnection);

    builder.Services.AddHostedService<RabbitMQConsumer>();
}



const string devCorsPolicy = "devCorsPolicy";

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: devCorsPolicy, policy =>
    {
        policy.WithOrigins("http://localhost:3000")
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials();
    });
});

builder.Services.AddDbContext<AppDbContext>(opt => 
    opt.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//app.UseHttpsRedirection();

app.UseCors(devCorsPolicy);

app.UseAuthorization();

app.MapControllers();

app.MapHub<PortfolioHub>("/portfolioHub");

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<AppDbContext>();
        await context.Database.MigrateAsync();
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while migrating the database.");
    }
}

app.Run();
