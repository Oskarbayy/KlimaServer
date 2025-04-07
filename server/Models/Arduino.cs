namespace Models
{
    public class Arduino
    {
        public int Id { get; set; }
        public string Location { get; set; }
        public string DeviceId { get; set; }
        public ICollection<TempReading> TemperatureReadings { get; set; }
    }
}

