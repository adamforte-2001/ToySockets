using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Builder;
using System.Net.WebSockets;

namespace WebSocketServer.Extensions;

public static class WebSocketRouteMapping
{
    public static WebApplication AddWebSocketEndpoint(this WebApplication app)
    {
        app.Map("/ws", async context =>
            {
            if (context.WebSockets.IsWebSocketRequest)
            {
                using var webSocket = await context.WebSockets.AcceptWebSocketAsync();
                Console.WriteLine("Client connected.");

                var buffer = new byte[1024 * 4];
                WebSocketReceiveResult result;
                do
                {
                    result = await webSocket.ReceiveAsync(
                        new ArraySegment<byte>(buffer),
                        CancellationToken.None);

                    if (result.MessageType == WebSocketMessageType.Text)
                    {
                        var msg = Encoding.UTF8.GetString(buffer, 0, result.Count);
                        Console.WriteLine($"Received: {msg}");

                        var response = ResponseService.GetResponseTo(msg);
                        var responseBytes = Encoding.UTF8.GetBytes(response);

                        await webSocket.SendAsync(
                            new ArraySegment<byte>(responseBytes),
                            WebSocketMessageType.Text,
                            endOfMessage: true,
                            cancellationToken: CancellationToken.None);
                    }
                }
                while (!result.CloseStatus.HasValue);

                await webSocket.CloseAsync(result.CloseStatus.Value, result.CloseStatusDescription, CancellationToken.None);
                Console.WriteLine("Client disconnected.");
            }
            else
            {
                context.Response.StatusCode = 400;
            }
        });

        return app;
    }
}
