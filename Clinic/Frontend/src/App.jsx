import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
//import Home from './pages/Dashboard/Home';
import './styles/global.css';
import { useEffect, useState } from 'react';

function App() {

  return (
    <Router>

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
      </Routes>
    </Router>
  );
}

export default App;