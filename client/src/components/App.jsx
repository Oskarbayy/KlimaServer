import { useState, useEffect } from 'react'
import '../styles/App.css'




function App() {
    const [currentTemp, setCurrentTemp] = useState(null)
    // const [data, setData] = useState([])
    // const [loading, setLoading] = useState(true)
    // const [errorMessage, setErrorMessage] = useState('')

    useEffect(() => {
        // async function fetchData() {
        //     try {
        //         // Try to query the Test table directly
        //         const { data: testData, error: testError } = await supabase
        //             .from('arduino_data')
        //             .select('*')

        //         if (testError) {
        //             console.error("Error querying Test table:", testError)
        //             setErrorMessage(`Query error: ${testError.message}`)
        //         } else {
        //             console.log("Test table data:", testData)
        //             setData(testData)
        //         }

               

        //     } catch (error) {
        //         console.error('Error in data operations:', error.message)
        //         setErrorMessage(`Operation error: ${error.message}`)
        //     } finally {
        //         setLoading(false)
        //     }
        // }
        getCurrentTemperature();


        // // Handle the promise returned by fetchData
        // fetchData().catch(error => {
        //     console.error("Unhandled error in fetchData:", error);
        //     setErrorMessage(`Unhandled error: ${error.message}`);
        //     setLoading(false);
        // });
    }, [])

     async function getCurrentTemperature() {
        try{
            const response = await fetch('https://klimaserver-production.up.railway.app/getCurrentTemperature', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                mode: 'cors',
        });
           
            if (!response.ok) {
                throw new Error(`error: ${response.status}`);
            }
            const data = await response.json();
            console.log('Fetched temperature:', data.temperature);
            setCurrentTemp(data.temperature);
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