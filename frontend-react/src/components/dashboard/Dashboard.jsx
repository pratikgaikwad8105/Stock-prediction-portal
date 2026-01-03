import axios from 'axios'
import React, {useEffect} from 'react'
import header from '../Header'
import axiosInstance from '../../axiosInstance'


function Dashboard() {
    const accessToken = localStorage.getItem('accessToken')
    useEffect(() => {
        const fetchProtecteddata = async () => {
            try{
                const response = await axiosInstance.get('/protected-view', {
            })
            }catch(error){
                console.error("Error Fetching Data :", error)
            }   
        }
        fetchProtecteddata()
    }, [])
  return (
    <div>Dashboard</div>
  )
}

export default Dashboard