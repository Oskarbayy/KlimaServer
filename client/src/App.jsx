import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { supabase } from './main.jsx'

function App() {
    const [count, setCount] = useState(0)
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchData() {
            try {
                // Try to query the Test table directly
                const { data: testData, error: testError } = await supabase
                    .from('Test')
                    .select('*')

                if (testError) {
                    console.error("Error querying Test table:", testError)
                    // Handle table not existing
                    if (testError.code === '42P01') {
                        console.log("The Test table doesn't exist. Please create it in the Supabase dashboard.")
                    }
                } else {
                    console.log("Test table data:", testData)
                    setData(testData)

                    // If table exists but is empty, insert test data
                    if (testData.length === 0) {
                        console.log("Test table is empty. Inserting test data...")

                        const { error: insertError } = await supabase
                            .from('Test')
                            .insert([
                                { name: 'Test Item 1', value: 42 },
                                { name: 'Test Item 2', value: 100 }
                            ])

                        if (insertError) {
                            console.error("Error inserting data:", insertError)
                        } else {
                            // Fetch the newly inserted data
                            const { data: newData } = await supabase
                                .from('Test')
                                .select('*')

                            setData(newData)
                            console.log("Inserted test data successfully:", newData)
                        }
                    }
                }
            } catch (error) {
                console.error('Error in data operations:', error.message)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
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
                <h2>Supabase Data</h2>
                {loading ? (
                    <p>Loading data...</p>
                ) : (
                    <div>
                        {data.length === 0 ? (
                            <p>No data found. Make sure you have a 'Test' table in your Supabase project.</p>
                        ) : (
                            <ul>
                                {data.map((item, index) => (
                                    <li key={item.id || index}>
                                        <pre>{JSON.stringify(item, null, 2)}</pre>
                                    </li>
                                ))}
                            </ul>
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