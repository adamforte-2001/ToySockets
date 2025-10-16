using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Text.Json;

namespace WebSocketServer;

public static class ResponseService
{
    public static string GetResponseTo(string message) 
    {
        var responseMessage = new StringBuilder();
        foreach (char c in message)
        {
            responseMessage.Append((char)(c + 3));
        }
        var response = JsonSerializer.Serialize<Object>(new { message = responseMessage.ToString() });
        return response;
    }
}
