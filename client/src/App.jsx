import {useState, useEffect} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {createClient} from '@supabase/supabase-js'

function App() {
    const [count, setCount] = useState(0)
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)

    const supabase = createClient(
        'https://uioawrrgevzolgdniqwz.supabase.co',
        import.meta.env.VITE_SUPABASE_KEY
    )

    useEffect(() => {
        async function fetchData() {
            try {
                const {data, error} = await supabase
                    .from('Test')
                    .select('*')

                if (error) throw error
                setData(data)
                console.log("Fetched data:", data)
            } catch (error) {
                console.error('Error fetching data:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    return (
        <div className="container">
            <div className="header">
                <a href="https://vite.dev" target="_blank" rel="noreferrer">
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
                            <p>No data found</p>
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