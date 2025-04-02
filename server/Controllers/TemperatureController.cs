using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class TemperatureController : ControllerBase
{
    [HttpPost]
    public IActionResult ReceiveTemperature([FromBody] TemperatureInput input)
    {
        Console.WriteLine($"Temperature from {input.DeviceId}: {input.Value}");
        return Ok(new
        {
            message = "Temperature received",
            received = input
        });
    }
}
