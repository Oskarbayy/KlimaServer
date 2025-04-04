using Models;
using Microsoft.EntityFrameworkCore;
using Data;

var builder = WebApplication.CreateBuilder(args);

// Setup database
// Get connection string from Railway (replace this with your actual one)
var connectionString = Environment.GetEnvironmentVariable("DATABASE_URL")
    ?? builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new Exception("Connection string not set.");

Console.WriteLine(connectionString);

// Register services
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));


builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Get connection string from configuration or environment variable as fallback
if (string.IsNullOrEmpty(connectionString))
{
    // Fallback to environment variable if not in appsettings
    connectionString = Environment.GetEnvironmentVariable("DATABASE_URL");
    if (string.IsNullOrEmpty(connectionString))
    {
        throw new Exception("Database connection string not found in configuration or environment variables.");
    }
}

// Add database context
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(connectionString));

var app = builder.Build();
TemperatureInput? curTemperatureFromArduino = null;

app.UseSwagger();   // Generates /swagger/v1/swagger.json
app.UseSwaggerUI(); // Serves Swagger UI at /swaggers

app.MapControllers();

app.MapGet("/getCurrentTemperature", () =>
{
    if (curTemperatureFromArduino is null)
    {
        return Results.NotFound(new { message = "No temperature received yet." });
    }

    return Results.Ok(new
    {
        temperature = curTemperatureFromArduino.Temperature,
        unit = curTemperatureFromArduino.Unit,
        time = DateTime.UtcNow
    });
});


app.MapPost("/recieveTemperature", (TemperatureInput input) =>
{
    Console.WriteLine($"Received: {input.Temperature} {input.Unit}");
    curTemperatureFromArduino = input;

    return Results.Ok(new
    {
        status = "success",
        received = input
    });
});


app.MapGet("/temperatures", async (AppDbContext db) =>
{
    var allEntries = await db.TemperatureEntries.ToListAsync();
    return Results.Ok(allEntries);
});

// Get the port from the environment variable "PORT".
var port = Environment.GetEnvironmentVariable("PORT")
           ?? throw new Exception("PORT environment variable not set.");

// Log the port to the console so you can see it in the deploy logs
Console.WriteLine($"Using port: {port}");

app.Run($"http://0.0.0.0:{port}");
