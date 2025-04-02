import { useState, useEffect } from 'react'
import reactLogo from '../assets/react.svg'
import viteLogo from '/vite.svg'
import '../styles/App.css'
/**
 * @typedef {import('@supabase/supabase-js').SupabaseClient} SupabaseClient
 * @type {SupabaseClient}
 */
import { supabase } from '../supabaseClient'


function App() {
    const [count, setCount] = useState(0)
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


    return (
        <div className="container">
            <div className="header">
                <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
                    <img src={viteLogo} className="logo" alt="Vite logo"/>
                </a>
                <a href="https://react.dev" target="_blank" rel="noreferrer">
                    <img src={reactLogo} className="logo react" alt="React logo"/>
                </a>
                <h1>Vite + React</h1>
            </div>

            <div className="card">
                <button onClick={() => setCount((count) => count + 1)}>
                    count is {count}
                </button>
                <p>
                    Edit <code>src/App.jsx</code> and save to test HMR
                </p>
            </div>

            <div className="supabase-data">
                <h2>Arduino Data</h2>
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
                                {data.map((item, index) => (
                                    <div key={item.id || index} className="data-item">
                                        {Object.entries(item)
                                            .filter(([key]) => key !== 'id') // Skip the ID field
                                            .map(([key, value]) => (
                                                <div key={key} className="data-property">
                                                    {key.includes('time') || key.includes('date') ? (
                                                        <span className="property-value">
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
                                                            <span className="property-name">
                                                                {key.replace(/_/g, ' ').split(' ').map(
                                                                    word => word.charAt(0).toUpperCase() + word.slice(1)
                                                                ).join(' ')}: </span> {/* Added space after the colon */}
                                                            <span className="property-value">
                                                                {typeof value === 'object' && value !== null
                                                                    ? 'Complex data'
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

            <p className="read-the-docs">
                Click on the Vite and React logos to learn more
            </p>
        </div>
    )
}

export default App