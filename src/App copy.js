import React from 'react'
import { render } from "react-dom";
import css from './App.css'
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
// components
import Loginpage from './pages/login/Loginpage';
import Layout from './pages/layout/Layout';
import Dashboard from './pages/layout/dashboard/Dashboard'
import Myprofile from './pages/layout/myprofile/Myprofile';
import MyPds from './pages/layout/pds/my_pds/MyPds';
import PersonalInfo from './pages/layout/pds/personal_info/PersonalInfo';
import UserRegistrationStepper from './pages/layout/stepper/UserRegistrationStepper';
import axios from 'axios'

// axios.defaults.baseURL = "http://localhost:8000"
axios.defaults.baseURL = window.location.protocol + '//'+window.location.hostname+'/pwabackend/public'
axios.defaults.withCredentials = true;
axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.defaults.headers.post['Accept'] = 'application/json'
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('hris_token')
  config.headers.Authorization = token ? `Bearer ${token}` : ''
  return config
})

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Loginpage />} />
        <Route path="/user-registration" element={<UserRegistrationStepper />} />
        <Route path="/homepage" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="personal-info" element={<PersonalInfo />} />
          <Route path="my-profile" element={<Myprofile />} />
          <Route path="my-pds" element={<MyPds />} >
            <Route path=":id" element={<MyPds />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
