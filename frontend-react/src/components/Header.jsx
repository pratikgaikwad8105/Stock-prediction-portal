import React from 'react'
import Button from './Button'
import { Link } from 'react-router-dom'

const header = () => {
  return (
    <>
      <nav className='navbar container pt-3 pb-3 align-items-start'>

        <Link className='navbar-brand text-light' to="/"><b>Stock Prediction Portal</b></Link>

        <div>
          <Button text="Login" class = "btn-info" url="/login" />
          &nbsp;
          <Button text="Register" class="btn-outline-info" url="/register"/>
        </div>

      </nav>
    </>
  )
}

export default header