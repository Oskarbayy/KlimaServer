namespace server.Models;

public class TemperatureReading
{
    public int Id { get; set; }
    public string DeviceId { get; set; } = string.Empty;
    public float Value { get; set; }
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}
