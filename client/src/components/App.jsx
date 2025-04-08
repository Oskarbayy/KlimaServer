import {useState, useEffect} from 'react';
import {climateAPI} from '../services/api';
import '../styles/App.css';

function App() {
    const [temperatureData, setTemperatureData] = useState([]);
    const [currentTemp, setCurrentTemp] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeData, setActiveData] = useState('temperature');


    useEffect(() => {
        async function loadTemperature() {
            try {
                setLoading(true);

                // Hent temperaturdata (liste af målinger)
                const tempData = await climateAPI.getCurrentTemperature();
                setTemperatureData(tempData);

                // Find og sæt den aktuelle temperatur (nyeste måling)
                if (tempData && tempData.length > 0) {
                    const latestTemp = [...tempData].sort((a, b) =>
                        new Date(b.timestamp) - new Date(a.timestamp)
                    )[0];
                    setCurrentTemp(latestTemp.value);
                }

                console.log('Hentet temperaturdata:', tempData);
            } catch (error) {
                console.error('Fejl ved hentning af temperatur:', error.message);
                setError('Kunne ikke hente temperatur fra serveren');
            } finally {
                setLoading(false);
            }
        }

        loadTemperature();
        const interval = setInterval(loadTemperature, 600000); // Opdater hvert minut
        return () => clearInterval(interval); // Ryd op ved unmount

    }, []);

    // Vis loading indikator mens data indlæses
    if (loading) {
        return (
            <div className="container loading">
                <p>Indlæser temperaturdata...</p>
            </div>
        );
    }

    // Vis fejlbesked hvis der opstod en fejl
    if (error) {
        return (
            <div className="container error">
                <p>{error}</p>
                <button onClick={() => window.location.reload()}>Prøv igen</button>
            </div>
        );
    }

    function temperaturCheck(value) {
        const temp = Number(value);
        switch (true) {
            case temp <= 0:
                return <i className="fa-solid fa-snowflake"></i>;
            case temp <= 5:
                return <i className="fa-solid fa-temperature-empty"></i>
            case temp <= 10:
                return <i className="fa-solid fa-temperature-quarter"></i>
            case temp <= 15:
                return <i className="fa-solid fa-temperature-half"></i>
            case temp <= 20:
                return <i className="fa-solid fa-temperature-three-quarters"></i>
            case temp <= 25:
                return <i className="fa-solid fa-temperature-full"></i>
            case temp <= 30:
                return <i className="fa-solid fa-sun"></i>;
            default:
                return null;
        }
    }


    return (


        <div className="container">

            <main className="content">
                {/* Her er hvor vi vil tilføje vores JSX */}
                <div className='data-container'>
                    
                    <div className='icon-container'>
                        {currentTemp && temperaturCheck(currentTemp)}
                    </div>

                    {/* Aktuel temperatur */}
                    <div className='data-item'>
                        {currentTemp !== null && (
                            <h2>{currentTemp.toFixed(2)}°C</h2>
                        )}
                    </div>
                    <div className='temperatureDate-container'>
                        <p>placholder</p>
                    </div>

                    

                    {/* Temperaturhistorik */}
                    {temperatureData.length > 0 && (
                        <div className='temperature-history'>
                            <h3>Temperaturhistorik</h3>
                            {temperatureData.map(item => (
                                <div key={item.id || item.timestamp} className="temperature-item">
                                    <p>{item.value.toFixed(1)}°{item.unit || 'C'}</p>
                                    <p className="timestamp">
                                        {new Date(item.timestamp).toLocaleString('da-DK')}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}

                    {loading && <p>Indlæser data...</p>}
                    {error && <p className="error">{error}</p>}
                </div>
            </main>

            <aside>
                <div
                    className={`temperaturButton ${activeData === 'temperature' ? 'active' : ''}`}
                    onClick={() => setActiveData('temperature')}
                >
                    <i className="fa-solid fa-temperature-three-quarters"></i>
                    <p>temperatur</p>
                </div>
                <div
                    className={`humidityButton ${activeData === 'humidity' ? 'active' : ''}`}
                    onClick={() => setActiveData('humidity')}
                >
                    <i className="fa-solid fa-droplet"></i>
                    <p>humidity</p>
                </div>
            </aside>
        </div>

    )
}

export default App