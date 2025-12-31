import Button from './Button'


function Main() {
  return (
    <>  
        <div className='container'>
            <div className="p-5 text-center bg-light-dark rounded">
              <h1 className='text-light'><b>Stock Prediction Portal</b></h1> 
              <p className='text-light lead'>The Stock Prediction Portal is a smart, user-friendly platform built to empower investors with accurate, data-driven market insights. Using advanced analytics and machine learning, it predicts stock trends and highlights profitable opportunities in real time. With interactive charts, clear forecasts, and a clean dashboard, users can make faster, smarter trading decisions. Whether you’re a beginner or an experienced trader, the portal simplifies market analysis and helps you stay ahead with confidence.
              </p>
              <Button text="Login" class="btn-info" url="/login" />
            </div>
        </div>
    </>
  )
}

export default Main