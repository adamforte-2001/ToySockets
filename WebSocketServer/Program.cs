using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using WebSocketServer.Extensions;
using WebSocketServer.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Azure.SignalR;

var builder = WebApplication.CreateBuilder(args);
using var loggerFactory = LoggerFactory.Create(loggingBuilder => loggingBuilder
                                        .SetMinimumLevel(LogLevel.Trace)
                                        .AddConsole());
var startupLogger = loggerFactory.CreateLogger<Program>();
builder.AddConfiguration(startupLogger);

var useAzureSignalR = builder.Configuration.GetValue<bool>("FeatureManagement:USE_AZURE_SIGNALR");
var signalRServerBuilder = builder.Services.AddSignalR();
if (useAzureSignalR)
{
    var AzureSignalRConnectionString = builder.Configuration.GetValue<string>("ConnectionStrings:SignalR");
    signalRServerBuilder.AddAzureSignalR(AzureSignalRConnectionString);
}

var frontendServer = builder.Configuration.GetValue<string>("FrontendServer:Server");
var frontendPort = builder.Configuration.GetValue<string>("FrontendServer:Port");
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowDev", builder =>
    {
        builder.WithOrigins($"https://{frontendServer}:{frontendPort}") 
            .AllowAnyHeader()
            .AllowAnyMethod() 
            .AllowCredentials(); 
    });
});
var app = builder.Build();
app.UseCors("AllowDev");
app.UseWebSockets();
app.UseHttpsRedirection();

app.AddWebSocketEndpoint();
app.MapHub<ChatHandler>("/sr");

app.Run();
