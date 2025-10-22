using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using Microsoft.Identity.Client;

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
        await Clients.Group(topic).SendAsync("receive", message, Context.ConnectionId);
    }

    public async Task AddClientToTopic(string prevTopic, string newTopic)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, prevTopic);
        await Groups.AddToGroupAsync(Context.ConnectionId, newTopic);
        await Clients.Caller.SendAsync("storeConnectionId", Context.ConnectionId);
    }
    
}
