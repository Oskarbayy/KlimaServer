var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer(); // Required for minimal APIs
builder.Services.AddSwaggerGen();          // Registers Swagger generator

var app = builder.Build();

app.UseSwagger();              // Generates /swagger/v1/swagger.json
app.UseSwaggerUI();           // Serves Swagger UI at /swagger

app.MapControllers();

app.MapGet("/getCurrentTemperature", () =>
{
    return "API is running";
});



// Get the port from the environment variable "PORT".
var port = Environment.GetEnvironmentVariable("PORT")
           ?? throw new Exception("PORT environment variable not set.");

// Log the port to the console so you can see it in the deploy logs
Console.WriteLine($"Using port: {port}");

app.Run($"http://0.0.0.0:{port}");
