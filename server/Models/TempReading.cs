using System.ComponentModel.DataAnnotations.Schema;

namespace Models
{
    [Table("temp")]
    public class TempReading
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("value")]
        public double Value { get; set; }

        [Column("timestamp")]
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;

        [Column("arduino_id")]
        public int ArduinoId { get; set; }

        public Arduino Arduino { get; set; } = null!;
    }
}
