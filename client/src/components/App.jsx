import { useState, useEffect } from 'react';
import { climateAPI } from '../services/api';
import '../styles/App.css';

function App() {
    const [currentTemp, setCurrentTemp] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadTemperature() {
            try {
                setLoading(true);
                const temperature = await climateAPI.getCurrentTemperature();
                setCurrentTemp(temperature);
                console.log('Hentet temperatur:', temperature);
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
                <div className='temperaturButton'>
                    <i className="fa-solid fa-temperature-three-quarters"></i>
                    <p>temperatur</p>
                </div>
                <div className='humidityButton'>
                    <i className="fa-solid fa-droplet"></i>
                    <p>humidity</p>
                </div>
                <div className='noiseLevelButton'>
                    <i className="fa-solid fa-volume-high"></i>
                    <p>noise level</p>
                </div >
                <div className='lightIntensityButton'>
                    <i className="fa-solid fa-lightbulb"></i>
                    <p>light intensity</p>
                </div>
            </aside>
                 <div className="data-container">
                 
                 <div className='data-item'></div>

                 <div className='icon-container'>
                        {currentTemp && temperaturCheck(currentTemp)}
                 </div>
                 </div>
        </div>
        
    )
}

export default App