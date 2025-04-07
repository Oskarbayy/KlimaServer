using System.ComponentModel.DataAnnotations.Schema;

namespace Models
{
    [Table("arduinos")]
    public class Arduino
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("location")]
        public string Location { get; set; } = null!;

        [Column("device_id")]
        public string DeviceId { get; set; } = null!;

        public ICollection<TempReading> TemperatureReadings { get; set; } = new List<TempReading>();
    }
}
