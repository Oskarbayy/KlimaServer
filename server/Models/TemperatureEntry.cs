using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Models;

[Table("temperatureentries")] // lowercase table name on railway.
public class TemperatureEntry
{
    [Key]
    public int id { get; set; }
    public double temperature { get; set; }
    public string unit { get; set; } = "C";
    public DateTimeOffset timestamp { get; set; } = DateTimeOffset.UtcNow;
}
