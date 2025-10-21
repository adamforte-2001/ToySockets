using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace WebSocketServer.Extensions
{
    public static class InitConfiguration
    {
        private const string LOCAL_APP_SETTINGS_FILE = "appsettings.local.json";
        public static WebApplicationBuilder AddConfiguration(this WebApplicationBuilder builder, ILogger logger)
        {
            if (!File.Exists(LOCAL_APP_SETTINGS_FILE))
            {
                throw new FileNotFoundException($"Error - {LOCAL_APP_SETTINGS_FILE} must be present");
            }
            try
            {
                builder
                    .Configuration
                    .SetBasePath(Directory.GetCurrentDirectory())
                    .AddJsonFile(LOCAL_APP_SETTINGS_FILE, optional: false, reloadOnChange: true);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Failed to load configuration");
                throw;
            }
            return builder;
        }
    }
}
