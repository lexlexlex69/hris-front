import React,{useEffect,useState} from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import axios from 'axios'

function ProtectedRoutes({ children }) {
    const navigate = useNavigate()
    useEffect(() => {
        if(!localStorage.getItem('hris_token'))
        {
            return <Navigate to="/hris" replace />
        }
        else {
            axios.get(`/api/getUserInformation`)
            .then(res => {
                console.log(res)
            })
            .catch(err => console.log(err))
        }
    },[])
    // if (!localStorage.getItem('hris_token')) {
    //     return <Navigate to="/hris" replace />;
    // }
    // else {
    //     axios.post(`/api/checkAuth`)
    //         .then(res => {
    //             console.log(res)
    //             if (res.data.status === 200) {
    //             }
    //         })
    //         .catch(err => {
    //             console.log(err.response.status)
    //             if (err.response.status === 401 || err.response.status === 419) {
    //                 localStorage.removeItem('hris_name')
    //                 localStorage.removeItem('hris_roles')
    //                 localStorage.removeItem('hris_token')
    //                 localStorage.removeItem('pds_id')
    //                 localStorage.removeItem('hris_stepper')
    //                 navigate('/hris')
    //             }
    //         })
    // }
    return children
}

export default ProtectedRoutes