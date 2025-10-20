using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using WebSocketServer.Extensions;
using WebSocketServer.Services;
using Microsoft.Extensions.Logging;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddSignalR();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowDev", builder =>
    {
        builder.WithOrigins("https://localhost:3000") // Replace with your allowed origins
            .AllowAnyHeader()
            .AllowAnyMethod() // Or AllowAnyMethod() for all
            .AllowCredentials(); // Important for SignalR authentication
    });
});
var app = builder.Build();
app.UseCors("AllowDev");
app.UseWebSockets();
app.UseHttpsRedirection();

app.AddWebSocketEndpoint();
app.MapHub<ChatHandler>("/sr");

app.Run();
