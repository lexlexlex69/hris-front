import React from "react";
import { Routes, Route, Link } from 'react-router-dom';
export default function Main (){
    return (
      <>
        <h1>React Router</h1>
  
        <Navigation />
  
        <Routes>
          <Route index element={<Landing />} />
          <Route path="landing" element={<Landing />} />
          <Route path="home" element={<Home />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="admin" element={<Admin />} />
          <Route path="*" element={<p>There's nothing here: 404!</p>} />
        </Routes>
      </>
    );
  };
const Navigation = () => (
    <nav>
      <Link to="/landing">Landing</Link>
      <Link to="/home">Home</Link>
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/analytics">Analytics</Link>
      <Link to="/admin">Admin</Link>
    </nav>
  );
const Landing = () => {
    return <h2>Landing (Public: anyone can access this page)</h2>;
  };
  
  const Home = () => {
    return <h2>Home (Protected: authenticated user required)</h2>;
  };
  
  const Dashboard = () => {
    return <h2>Dashboard (Protected: authenticated user required)</h2>;
  };
  
  const Analytics = () => {
    return (
      <h2>
        Analytics (Protected: authenticated user with permission
        'analyze' required)
      </h2>
    );
  };
  
  const Admin = () => {
    return (
      <h2>
        Admin (Protected: authenticated user with role 'admin' required)
      </h2>
    );
  };