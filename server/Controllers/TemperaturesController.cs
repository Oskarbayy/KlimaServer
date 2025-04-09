using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Data;
using System.Threading.Tasks;

namespace Controllers
{
    [ApiController]
    public class TemperaturesController : ControllerBase
    {
        private readonly AppDbContext _db;

        public TemperaturesController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet("/temperatures")]
        public async Task<IActionResult> GetAllTemperatures()
        {
            var allEntries = await _db.Temp.ToListAsync();
            return Ok(allEntries);
        }
    }
}
