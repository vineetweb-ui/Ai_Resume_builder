import React, { useEffect } from 'react'
import { Route,Routes } from 'react-router-dom'
import Home from './pages/Home'
import Layout from './pages/Layout'
import Dashboard from './pages/Dashboard'
import ResumeBuilder from './pages/ResumeBuilder'
import Preview from './pages/Preview'
import Login from './pages/Login'
import { useDispatch } from 'react-redux'

import { login, setloading } from './app/features/authslice'
import {Toaster} from 'react-hot-toast'
import api from './configs/api'

const App = () => {
  const dispatch = useDispatch()
  const getuserData= async ()=>{
    const token = localStorage.getItem('token')
    try {
      if(token){
        const { data }= await api.get('/api/users/data',{headers:{Authorization: token}})
        if(data.user){
          dispatch(login({token,user:data.user}))
        }
        dispatch(setloading(false))
      }else{
        dispatch(setloading(false))
      }
    } catch (error) {
dispatch(setloading(false))
console.log(error.message)
}
  }
  useEffect(()=>{
    getuserData()
  },[])
  return (
    <>
    <Toaster/>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='app' element={<Layout/>}>
      <Route index element={<Dashboard/>} />
      <Route path='builder/:resumeId' element={<ResumeBuilder/>}/>

      </Route>
      <Route path='view/:resumeId' element={<Preview/>}/>
      
    
    </Routes>
    </>
  )
}

export default App