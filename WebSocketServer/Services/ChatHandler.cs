using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;

namespace WebSocketServer.Services;

public class ChatHandler : Hub
{
    /*
    private readonly ILogger<ChatHandler> _logger;
    ChatHandler(ILogger<ChatHandler> logger)
    {
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }
    */
    public async Task Send(string message, string topic)
    {
        await Clients.All.SendAsync("receive", message);
    }
    
}
