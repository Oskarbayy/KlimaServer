using Microsoft.EntityFrameworkCore;
using KlimaServer.Models;

namespace KlimaServer.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options) { }

    public DbSet<TemperatureReading> TemperatureReadings => Set<TemperatureReading>();
}
