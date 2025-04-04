using Microsoft.Extensions.Configuration;
using Npgsql;

namespace Helpers
{
    public static class ConnectionHelper
    {
        public static string GetConnectionString(IConfiguration config)
        {
            var databaseUrl = Environment.GetEnvironmentVariable("DATABASE_URL");
            Console.WriteLine("databaseURL:", databaseUrl);

            if (!string.IsNullOrWhiteSpace(databaseUrl) &&
                (databaseUrl.StartsWith("postgres://") || databaseUrl.StartsWith("postgresql://")))
            {
                var uri = new Uri(databaseUrl);
                var userInfo = uri.UserInfo.Split(':');

                var builder = new Npgsql.NpgsqlConnectionStringBuilder
                {
                    Host = uri.Host,
                    Port = uri.Port,
                    Username = userInfo[0],
                    Password = userInfo[1],
                    Database = uri.AbsolutePath.TrimStart('/'),
                    SslMode = SslMode.Require,
                    TrustServerCertificate = true
                };

                Console.WriteLine("returning builder conncetionstring", builder.ConnectionString);
                return builder.ConnectionString;
            }

            var fallback = config.GetConnectionString("DefaultConnection");

            if (!string.IsNullOrWhiteSpace(fallback))
                return fallback;

            throw new Exception("No valid database connection string found. Please set DATABASE_URL or configure DefaultConnection.");
        }
    }
}
