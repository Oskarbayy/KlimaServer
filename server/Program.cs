var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();

var app = builder.Build();
app.MapControllers();

// Get the port from the environment (Railway sets it) or default to 3000
var port = Environment.GetEnvironmentVariable("PORT") ?? "3000";
app.MapGet("/", () => "API is running");

app.Run($"http://0.0.0.0:{port}");
