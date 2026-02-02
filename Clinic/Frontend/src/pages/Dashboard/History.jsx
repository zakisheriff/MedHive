import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import './css/History.css';

const History = () => {
  // Mock data representing a week of "Available" vs "Not Available" clicks
  const [analyticsData] = useState([
    { day: 'Mon', available: 45, oos: 5 },
    { day: 'Tue', available: 52, oos: 8 },
    { day: 'Wed', available: 38, oos: 12 },
    { day: 'Thu', available: 65, oos: 4 },
    { day: 'Fri', available: 48, oos: 9 },
    { day: 'Sat', available: 30, oos: 2 },
    { day: 'Sun', available: 20, oos: 1 },
  ]);

  return (
    <div className="history-container">
      <header className="history-header">
        <h1>Stock & History Analytics</h1>
        <p>Overview of pharmacy fulfillment and inventory trends.</p>
      </header>

      {/* 1. TOP-LEVEL VITAL STATS */}
      <section className="stats-grid">
        <div className="stat-card">
          <label>Fulfillment Rate</label>
          <div className="value">92.4%</div>
          <span className="trend positive">+2.1% from last week</span>
        </div>
        <div className="stat-card">
          <label>Most Requested</label>
          <div className="value">Metformin</div>
          <span className="sub-text">Used in 42% of orders</span>
        </div>
        <div className="stat-card warning">
          <label>Critical OOS</label>
          <div className="value">Amoxicillin</div>
          <span className="trend negative">Marked "Not Available" 18 times</span>
        </div>
      </section>

      {/* 2. VISUAL ANALYTICS  */}
      <section className="chart-section">
        <h3>Weekly Fulfillment Overview</h3>
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analyticsData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip cursor={{fill: '#f8f9fa'}} />
              <Legend verticalAlign="top" align="right" iconType="circle" />
              <Bar dataKey="available" name="Available" fill="#f1a63b" radius={[4, 4, 0, 0]} />
              <Bar dataKey="oos" name="Not Available" fill="#dc2626" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* 3. RECENT LOG (TIMELINE STYLE) */}
      <section className="history-log">
        <h3>Recent Dispensing Log</h3>
        <div className="log-table">
          <div className="log-header">
            <span>Patient</span>
            <span>ID</span>
            <span>Date/Time</span>
            <span>Status</span>
          </div>
          <div className="log-row">
            <span>Abdul Raheem</span>
            <span className="mh-tag">@mh001</span>
            <span>Feb 01, 2026 | 06:12 PM</span>
            <span className="status-pill dispensed">Dispensed</span>
          </div>
          <div className="log-row">
            <span>Sarah Firthouse</span>
            <span className="mh-tag">@mh042</span>
            <span>Feb 01, 2026 | 08:45 PM</span>
            <span className="status-pill dispensed">Dispensed</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default History;