using Models;
using Microsoft.EntityFrameworkCore;
using Data;
using Helpers;

var builder = WebApplication.CreateBuilder(args);

builder.Logging.AddConsole();
builder.Logging.SetMinimumLevel(LogLevel.Debug);

var connectionString = ConnectionHelper.GetConnectionString(builder.Configuration);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>
    {
        builder
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

// Og så anvend politikken:
app.UseCors("AllowAll");




builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

WebApplication app;

try
{
    app = builder.Build();
}
catch (Exception ex)
{
    Console.WriteLine("Exception during app.Build(): " + ex);
    throw;
}



TemperatureInput? curTemperatureFromArduino = null;

// Setting up swagger to easily see API endpoints
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

var port = Environment.GetEnvironmentVariable("PORT")
           ?? throw new Exception("PORT environment variable not set.");
try
{
    app.Run($"http://0.0.0.0:{port}");
}
catch (Exception ex)
{
    throw;
}
