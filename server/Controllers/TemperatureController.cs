using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class TemperatureController : ControllerBase
{
    [HttpPost]
    public IActionResult ReceiveTemperature([FromBody] TemperatureInput input)
    {
        // Just log or respond for now — no DB
        Console.WriteLine($"Temperature from {input.DeviceId}: {input.Value} °C");

        return Ok(new
        {
            message = "Temperature received",
            received = input
        });
    }
}
