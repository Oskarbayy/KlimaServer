using KlimaServer.Models;

namespace KlimaServer.Services;

public interface ITemperatureService
{
    Task SaveTemperatureAsync(TemperatureReading reading);
}
