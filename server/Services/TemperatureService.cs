using KlimaServer.Data;
using KlimaServer.Models;

namespace KlimaServer.Services;

public class TemperatureService : ITemperatureService
{
    private readonly AppDbContext _context;

    public TemperatureService(AppDbContext context)
    {
        _context = context;
    }

    public async Task SaveTemperatureAsync(TemperatureReading reading)
    {
        reading.Timestamp = DateTime.UtcNow;
        _context.TemperatureReadings.Add(reading);
        await _context.SaveChangesAsync();
    }
}
