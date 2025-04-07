using System.ComponentModel.DataAnnotations.Schema;

namespace Models
{
    [Table("temp")]
    public class TempReading
    {
        public int Id { get; set; }
        public double Value { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
        public int ArduinoId { get; set; }
        public Arduino Arduino { get; set; }
    }
}