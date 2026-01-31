import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
//import DashboardLayout from './pages/Dashboard/Layout';
import './styles/global.css';
import { useEffect, useState } from 'react';
import AuthPage from './pages/Auth/AuthPage';

function App() {

  return (
    <Router>

      <Routes>
        <Route path='/home' element={<DashboardLayout/>} />
        <Route path='/' element={<AuthPage/>} />
      </Routes>
    </Router>
  );
}

export default App;