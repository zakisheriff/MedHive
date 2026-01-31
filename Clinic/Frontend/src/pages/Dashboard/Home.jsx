import React from 'react';
import './css/Home.css'; // Ensure the path to your CSS is correct

const Home = () => {
  // Ensure this image is in your public/ folder
  const mainLogo = "    "; 

  return (
    <div className="home-content">
      <main className="hero-section">
        <div className="hero-content">
          <img src={mainLogo} className="central-logo" />
        </div>
      </main>
    </div>
  );
};

export default Home;