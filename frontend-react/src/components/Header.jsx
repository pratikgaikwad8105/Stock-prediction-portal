import {useContext} from 'react'
import Button from './Button'
import { Link } from 'react-router-dom'
import { AuthContext } from '../AuthProvider'
import { useNavigate } from "react-router-dom"


const header = () => {
  const {isLoggedIn, setIsLoggedIn} = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogOut = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    setIsLoggedIn(false)
    navigate("/login")
  }
  
  return (
    <>
      <nav className='navbar container pt-3 pb-3 align-items-start'>

        <Link className='navbar-brand text-light' to="/"><b>Stock Prediction Portal</b></Link>

        <div>

          {isLoggedIn ? (
            <button className='btn btn-danger' onClick={handleLogOut}>Logout</button>
          ) : (
            <>
              <Button text="Login" class = "btn-info" url="/login" />
              &nbsp;
              <Button text="Register" class="btn-outline-info" url="/register"/>
            </>
          )}
        </div>

      </nav>
    </>
  )
}

export default header