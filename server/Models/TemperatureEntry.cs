using System.ComponentModel.DataAnnotations.Schema;

namespace Models;

[Table("temperatureentries")] // lowercase table name on railway.
public class TemperatureEntry
{
    public int id { get; set; }
    public double temperature { get; set; }
    public string unit { get; set; } = "C";
    public DateTime timestamp { get; set; } = DateTime.UtcNow;
}
