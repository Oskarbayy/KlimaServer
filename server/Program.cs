var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();

var app = builder.Build();
app.MapControllers();
app.MapGet("/", () => "API is running");

// Get the port from the environment variable "PORT".
// If it's not set, throw an exception.
var port = Environment.GetEnvironmentVariable("PORT")
           ?? throw new Exception("PORT environment variable not set.");

// Log the port to the console so you can see it in the deploy logs
Console.WriteLine($"Using port: {port}");

app.Run($"http://0.0.0.0:{port}");
