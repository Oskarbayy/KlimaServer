using Microsoft.AspNetCore.Mvc;
using KlimaServer.Models;
using KlimaServer.Services;

namespace KlimaServer.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TemperatureController : ControllerBase
{
    private readonly ITemperatureService _service;

    public TemperatureController(ITemperatureService service)
    {
        _service = service;
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] TemperatureReading input)
    {
        if (string.IsNullOrWhiteSpace(input.DeviceId))
            return BadRequest("DeviceId is required.");

        await _service.SaveTemperatureAsync(input);

        return Ok(new
        {
            message = "Temperature saved",
            received = input
        });
    }
}
