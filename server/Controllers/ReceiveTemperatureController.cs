using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models;
using Data;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Controllers
{
    [ApiController]
    public class ReceiveTemperatureController : ControllerBase
    {
        private readonly AppDbContext _db;

        public ReceiveTemperatureController(AppDbContext db)
        {
            _db = db;
        }

        [HttpPost("/receiveTemperature")]
        public async Task<IActionResult> ReceiveTemperature([FromBody] TemperatureInput input)
        {
            Console.WriteLine($"Received temperature {input.Value}°C from {input.DeviceId} at {input.Location}");

            CurrentTemperatureController.UpdateTemperature(input);

            var cutoff = DateTime.UtcNow.AddDays(-7);
            var oldReadings = _db.Temp.Where(t => t.Timestamp < cutoff);
            _db.Temp.RemoveRange(oldReadings);
            await _db.SaveChangesAsync();

            var arduino = await _db.Arduinos
                .FirstOrDefaultAsync(a => a.Location == input.Location && a.DeviceId == input.DeviceId);

            if (arduino == null)
            {
                arduino = new Arduino
                {
                    Location = input.Location,
                    DeviceId = input.DeviceId
                };
                _db.Arduinos.Add(arduino);
                await _db.SaveChangesAsync();
            }

            var tempReading = new TempReading
            {
                Value = input.Value,
                ArduinoId = arduino.Id
            };
            _db.Temp.Add(tempReading);
            await _db.SaveChangesAsync();

            return Ok(new
            {
                status = "success",
                arduino_id = arduino.Id,
                received = input
            });
        }
    }
}
