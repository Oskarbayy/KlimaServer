var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();

var app = builder.Build();

app.MapControllers(); // Activate controller endpoints like /api/temperature

app.Run(); // Start the server
