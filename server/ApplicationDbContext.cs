using Microsoft.EntityFrameworkCore;
using Models;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }
    
    // Define DbSet properties for your models
    // For example, if you want to store temperature readings:
    public DbSet<TemperatureReading> TemperatureReadings { get; set; }
}

// Add this class to store temperature records if needed
public class TemperatureReading
{
    public int Id { get; set; }
    public float Temperature { get; set; }
    public string Unit { get; set; }
    public DateTime Timestamp { get; set; }
}