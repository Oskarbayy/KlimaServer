using Microsoft.Extensions.Configuration;
using Npgsql;

namespace Helpers
{
    public static class ConnectionHelper
    {
        public static string GetConnectionString(IConfiguration config)
        {
            var databaseUrl = Environment.GetEnvironmentVariable("DATABASE_URL");

            if (!string.IsNullOrWhiteSpace(databaseUrl) &&
                (databaseUrl.StartsWith("postgres://") || databaseUrl.StartsWith("postgresql://")))
            {
                var uri = new Uri(databaseUrl);
                var userInfo = uri.UserInfo.Split(':');

                var builder = new NpgsqlConnectionStringBuilder
                {
                    Host = uri.Host,
                    Port = uri.Port,
                    Username = userInfo[0],
                    Password = userInfo[1],
                    Database = uri.AbsolutePath.TrimStart('/'),
                    SslMode = SslMode.Require,
                    TrustServerCertificate = true
                };

                return builder.ConnectionString;
            }

            return config.GetConnectionString("DefaultConnection")
                ?? "Host=localhost;Port=5432;Database=localdb;Username=postgres;Password=secret";
        }
    }
}
