using Microsoft.EntityFrameworkCore;
using Models;

namespace Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<TemperatureEntry> TemperatureEntries { get; set; } = null!;
    public DbSet<Arduino> Arduinos { get; set; } = null!;
    public DbSet<TempReading> Temp { get; set; } = null!;
}
