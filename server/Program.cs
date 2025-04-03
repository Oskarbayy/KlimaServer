using Data;
using Microsoft.EntityFrameworkCore;
using Models;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Setup database
// Get connection string from Railway (replace this with your actual one)
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? Environment.GetEnvironmentVariable("DATABASE_URL")
    ?? throw new Exception("Connection string not set.");

// Register services
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));


builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Get connection string from configuration or environment variable as fallback
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
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


<<<<<<< HEAD
app.MapPost("/recieveTemperature", (TemperatureInput input) =>
=======
app.MapPost("/recieveTemperature", async (TemperatureInput input, AppDbContext db) =>
>>>>>>> test_database_osha
{
    var entry = new TemperatureEntry
    {
        temperature = input.Temperature,
        unit = input.Unit
    };

    await db.TemperatureEntries.AddAsync(entry);
    await db.SaveChangesAsync();

    return Results.Ok(new
    {
        status = "success",
        saved = entry
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
