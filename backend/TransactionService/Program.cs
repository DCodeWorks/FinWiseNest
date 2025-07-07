using FinWiseNest.Data;
using FinWiseNest.Data.Messaging;
using Microsoft.EntityFrameworkCore;
using RabbitMQ.Client;
using TransactionService.Messaging;

var builder = WebApplication.CreateBuilder(args);


// here I want to use RabbitMQ only in development, is free and no azure setup is needed 
//in this phase of the project
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

    builder.Services.AddScoped<IMessageService, RabbitMQMessagingService>();
}



builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

const string devCorsPolicy = "devCorsPolicy";

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: devCorsPolicy, policy =>
    {
        policy.WithOrigins("http://localhost:3000")
        .AllowAnyHeader()
        .AllowAnyMethod();
    });
});

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
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

app.Run();
