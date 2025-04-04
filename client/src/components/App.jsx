import {useState, useEffect} from 'react';
import {climateAPI} from '../services/api';
import '../styles/App.css';

function App() {
    const [temperatureData, setTemperatureData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeData, setActiveData] = useState('temperature');


    useEffect(() => {
        async function loadTemperature() {
            try {
                setLoading(true);
                const tempData = await climateAPI.getCurrentTemperature();
                setTemperatureData(tempData);

                console.log('Hentet temperaturdata:', tempData);
            } catch (error) {
                console.error('Fejl ved hentning af temperatur:', error.message);
                setError('Kunne ikke hente temperatur fra serveren');
            } finally {
                setLoading(false);
            }
        }

        loadTemperature();
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
            case temp <= 5:
                return <i className="fa-solid fa-snowflake"></i>;
            case temp <= 10:
                return <i className="fa-solid fa-temperature-empty"></i>
            case temp <= 15:
                return <i className="fa-solid fa-temperature-quarter"></i>
            case temp <= 20:
                return <i className="fa-solid fa-temperature-half"></i>
            case temp <= 25:
                return <i className="fa-solid fa-temperature-three-quarters"></i>
            case temp <= 30:
                return <i className="fa-solid fa-temperature-full"></i>
            case temp <= 35:
                return <i className="fa-solid fa-sun"></i>;
            default:
                return null;
        }
    }


    return (


        <div className="container">
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
            <div className="data-container">

                <div className='data-item'>
                    {temperatureData.length > 0 ? (
                        <div className="temperature-data">
                            <h2>Temperatur</h2>
                            {temperatureData.map(item => (
                                <div key={item.id} className="temperature-item">
                                    <p className="temp-value">{item.temperature.toFixed(1)}°{item.unit}</p>
                                    <p className="temp-timestamp">
                                        {new Date(item.timestamp).toLocaleString('da-DK')}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>Ingen temperaturdata tilgængelig</p>
                    )}
                </div>

                <div className='icon-container'>
                    {temperatureData.length > 0 && temperaturCheck(temperatureData[0].temperature)}
                </div>
            </div>
        </div>

    )
}

export default App