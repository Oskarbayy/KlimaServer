using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")] // /api/temperature
public class TemperatureController : ControllerBase
{
    [HttpPost]
    public IActionResult ReceiveTemperature([FromBody] TemperatureInput input)
    {
        Console.WriteLine($"Received from {input.DeviceId}: {input.Value} °C");

        return Ok(new
        {
            message = "Received!",
            data = input
        });
    }
}
