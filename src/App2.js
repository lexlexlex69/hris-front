import React, { useEffect } from 'react'
import { render } from "react-dom";
import css from './App.css'
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
// components
import Loginpage from './pages/login/Loginpage';
import Maintenance from './pages/layout/Maintenance';
import axios from 'axios'
/**
 * verify account
 */
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
        <Route path="/hris" element={<Maintenance/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
