namespace Models
{
    public class TemperatureInput
    {
        public double Value { get; set; }
        required public string Location { get; set; }
        required public string DeviceId { get; set; }
    }
}
