using Models;
using Microsoft.EntityFrameworkCore;
using Data;
using Helpers;

Console.WriteLine("[A] Starting application builder");

var builder = WebApplication.CreateBuilder(args);

Console.WriteLine("[B] Configuring logging");
builder.Logging.AddConsole();
builder.Logging.SetMinimumLevel(LogLevel.Debug);

Console.WriteLine("[C] Getting connection string");
var connectionString = ConnectionHelper.GetConnectionString(builder.Configuration);
Console.WriteLine($"[C1] Connection string: {connectionString}");

Console.WriteLine("[D] Registering AppDbContext");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

Console.WriteLine("[E] Registering services");
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

Console.WriteLine("[F] Building app");
var app = builder.Build();
Console.WriteLine("[G] App built");

TemperatureInput? curTemperatureFromArduino = null;

Console.WriteLine("[H] Setting up Swagger");
app.UseSwagger();   // Generates /swagger/v1/swagger.json
app.UseSwaggerUI(); // Serves Swagger UI at /swaggers

Console.WriteLine("[I] Mapping controllers and endpoints");
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
    Console.WriteLine($"[J] Received: {input.Temperature} {input.Unit}");
    curTemperatureFromArduino = input;

    return Results.Ok(new
    {
        status = "success",
        received = input
    });
});

app.MapGet("/temperatures", async (AppDbContext db) =>
{
    Console.WriteLine("[K] Fetching all temperature entries from DB");
    var allEntries = await db.TemperatureEntries.ToListAsync();
    return Results.Ok(allEntries);
});

Console.WriteLine("[L] Getting PORT env variable");
var port = Environment.GetEnvironmentVariable("PORT")
           ?? throw new Exception("PORT environment variable not set.");

Console.WriteLine($"[M] Using port: {port}");

Console.WriteLine("[N] Running app");
try
{
    app.Run($"http://0.0.0.0:{port}");
}
catch (Exception ex)
{
    Console.WriteLine("[Z] Fatal error on app.Run(): " + ex);
    throw;
}
