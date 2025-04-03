import { useState, useEffect } from 'react'
import '../styles/App.css'

/**
 * @typedef {import('@supabase/supabase-js').SupabaseClient} SupabaseClient
 * @type {SupabaseClient}
 */
import { supabase } from '../supabaseClient'


function App() {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [errorMessage, setErrorMessage] = useState('')

    useEffect(() => {
        async function fetchData() {
            try {
                // Try to query the Test table directly
                const { data: testData, error: testError } = await supabase
                    .from('arduino_data')
                    .select('*')

                if (testError) {
                    console.error("Error querying Test table:", testError)
                    setErrorMessage(`Query error: ${testError.message}`)
                } else {
                    console.log("Test table data:", testData)
                    setData(testData)
                }

               getCurrentTemperature();
               

            } catch (error) {
                console.error('Error in data operations:', error.message)
                setErrorMessage(`Operation error: ${error.message}`)
            } finally {
                setLoading(false)
            }
        }

        // Handle the promise returned by fetchData
        fetchData().catch(error => {
            console.error("Unhandled error in fetchData:", error);
            setErrorMessage(`Unhandled error: ${error.message}`);
            setLoading(false);
        });
    }, [])

     async function getCurrentTemperature() {
        try{
            const response = await fetch('https://klimaserver-production.up.railway.app/getCurrentTemperature')
           
            if (!response.ok) {
                throw new Error(`error: ${response.status}`);
            }
            const data = await response.json();
            console.log('Fetched temperature:', data.temperature);
            return data.temperature;
        }catch(error) {
            console.error('Error fetching temperature:', error.message);
            return null;
        }
     }

     function temperaturCheck(value) {
        
        const temp = Number(value);
        switch (true) {
            case temp <= 5:
                return<i  className="fa-solid fa-snowflake"></i>;
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
                    <i class="fa-solid fa-temperature-three-quarters"></i>
                    <p>temperatur</p>
                </div>
                <div className='humidityButton'>
                    <i class="fa-solid fa-droplet"></i>
                    <p>humidity</p>
                </div>
                <div className='noiseLevelButton'>
                    <i class="fa-solid fa-volume-high"></i>
                    <p>noise level</p>
                </div >
                <div className='lightIntensityButton'>
                    <i class="fa-solid fa-lightbulb"></i>
                    <p>light intensity</p>
                </div>
            </aside>

            <div className="supabase-data">
                
                {loading ? (
                    <p>Loading data...</p>
                ) : (
                    <div>
                        {errorMessage && (
                            <div className="error-message" style={{color: 'red'}}>
                                <p>Error: {errorMessage}</p>
                            </div>
                        )}

                        {data.length === 0 ? (
                            <p>No data found in the Arduino table.</p>
                        ) : (
                            <div className="data-container">
                                           <div className='icon-container'>
                                                {data[0] && temperaturCheck(data[0].temperature)}
                                           </div>

                                {data.map((item, index) => (
                                    <div key={item.id || index} className="data-item">
                                        {Object.entries(item)
                                            .filter(([key]) => key !== 'id') // Skip the ID field
                                            .map(([key, value]) => (
                                                <div key={key} className="data-property">
                                                    {key.includes('time') || key.includes('date') ? (
                                                        <span className="property-date">
                                                            {new Date(value).toLocaleString(undefined, {
                                                                year: 'numeric',
                                                                month: 'short',
                                                                day: 'numeric',
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                            })}
                                                        </span>
                                                    ) : (
                                                        <>
                                                           
                                                            <span className="property-value">
                                                                {typeof value === 'object' && value !== null
                                                                    ? 'Complex data'
                                                                    : key.toLowerCase().includes('temp') 
                                                                        ? `${String(value)}°C`
                                                                        : String(value)
                                                                }
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            ))}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

           
        </div>
        
    )
}

export default App