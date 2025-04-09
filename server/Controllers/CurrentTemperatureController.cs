using Microsoft.AspNetCore.Mvc;
using Models;

namespace Controllers
{
    [ApiController]
    public class CurrentTemperatureController : ControllerBase
    {
        private static TemperatureInput? _curTemperatureFromArduino = null;

        [HttpGet("/getCurrentTemperature")]
        public IActionResult GetCurrentTemperature()
        {
            if (_curTemperatureFromArduino is null)
            {
                return NotFound(new { message = "No temperature received yet." });
            }

            return Ok(new
            {
                temperature = _curTemperatureFromArduino.Value,
                unit = "Celcius",
                time = DateTime.UtcNow
            });
        }

        public static void UpdateTemperature(TemperatureInput input)
        {
            _curTemperatureFromArduino = input;
        }
    }
}
