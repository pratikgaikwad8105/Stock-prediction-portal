import React, { useEffect, useState } from 'react'
import axiosInstance from '../../axiosInstance'
import { useActionData } from 'react-router-dom'


function Dashboard() {
    const [ticker, setTicker] = useState('')
    const accessToken = localStorage.getItem('accessToken')
    const [error, setError] = useState()
    const [loading, setLoading] = useState(false)
    const [plot, setPlot] = useState()
    const [ma100, setMa100] = useState()
    const [ma200, setMa200] = useState()
    const [prediction, setPrediction] = useState()
    const [mse, setMse] = useState()
    const [rmse, setRmse] = useState()
    const [r2, setR2] = useState()
    useEffect(() => {
        const fetchProtecteddata = async () => {
            try {
                const response = await axiosInstance.get('/protected-view', {
                })
            } catch (error) {
                console.error("Error Fetching Data :", error)
            }
        }
        fetchProtecteddata()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        try {
            const response = await axiosInstance.post('predict/', {
                ticker: ticker
            })
            if (response.data.error) {
                setError(response.data.error)
            }
            const backend_url = import.meta.env.VITE_BACKEND_ROOT_URL
            const plot_url = `${backend_url}${response.data.plot_img}`
            const plot_ma100_url = `${backend_url}${response.data.plot_100_dma}`
            const plot_ma200_url = `${backend_url}${response.data.plot_200_dma}`
            const prediction_url = `${backend_url}${response.data.plot_prediction}`

            setPlot(plot_url)
            setMa100(plot_ma100_url)
            setMa200(plot_ma200_url)
            setPrediction(prediction_url)
            setMse(response.data.mse)
            setRmse(response.data.rmse)
            setR2(response.data.r2)

        } catch (error) {
            console.error("Error requesting API")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='container'>
            <div className="row">
                <div className="col-md-6 mx-auto">
                    <form onSubmit={handleSubmit}>
                        <input type="text" className='form-control' placeholder='Stock Ticker' required

                            onChange={(e) => setTicker(e.target.value)}
                        />
                        <small>{error && <div className="text-danger">{error}</div>}</small>

                        {loading ? (
                            <button type='submit' className='btn btn-info mt-3'>Please Wait...</button>
                        ) : (
                            <button type='submit' className='btn btn-info mt-3'>Predict</button>
                        )}
                    </form>

                </div>
                {/* Print Prediction Plots  */}

                {prediction && (
                    <div className="prediction mt-5" >
                        <div className="p-3">
                            {plot && (
                                <img src={plot} alt="plot_img" className="img-fluid mx-auto d-block" style={{ maxWidth : "100%"}} />
                            )}
                        </div>

                        <div className="p-3">
                            {ma100 && (
                                <img src={ma100} alt="ma100_img" className="img-fluid mx-auto d-block" style={{ maxWidth : "100%"}} />
                            )}
                        </div>

                        <div className="p-3">
                            {ma100 && (
                                <img src={ma200} alt="ma200_img" className="img-fluid mx-auto d-block" style={{ maxWidth : "100%"}} />
                            )}
                        </div>

                        <div className="p-3">
                            {prediction && (
                                <img src={prediction} alt="prediction_img" className="img-fluid mx-auto d-block" style={{ maxWidth : "100%"}} />
                            )}
                        </div>

                        <div className="text-light p-3">
                            <h4>Model Evalution</h4>
                            <p>Mean Squared Error(MSE) : {mse}</p>
                            <p>Root Mean Squared Error(RMSE) : {rmse}</p>
                            <p>R-Squared(R2) : {r2}</p>
                        </div>

                    </div>
                )}
            </div>
        </div>
    )
}

export default Dashboard