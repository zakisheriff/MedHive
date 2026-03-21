import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TrendingUp } from 'lucide-react';

const DiseaseIntelligence = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hoveredRow, setHoveredRow] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/epidemiology/weekly-report');
        setData(res.data);
      } catch (err) {
        console.error("Report Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  // Extract disease names from the first district's breakdown object
  const diseaseNames = data?.districts?.[0]?.breakdown ? Object.keys(data.districts[0].breakdown) : [];

  const s = {
    container: {
      padding: '2rem',
      backgroundColor: '#fcfcfc',
      minHeight: '100vh',
      fontFamily: "'Inter', sans-serif",
      color: '#2d3436',
    },
    bulletinHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderLeft: '5px solid #dca349',
      padding: '1.5rem',
      backgroundColor: '#ffffff',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.02)',
      borderRadius: '0 8px 8px 0',
      marginBottom: '2rem',
    },
    badge: {
      fontSize: '0.7rem',
      fontWeight: '800',
      textTransform: 'uppercase',
      color: '#dca349',
      letterSpacing: '1px',
      display: 'block',
      marginBottom: '0.5rem',
    },
    title: {
      fontSize: '1.8rem',
      fontWeight: '700',
      margin: 0,
      color: '#1e272e',
    },
    subtitle: {
      color: '#7f8c8d',
      fontSize: '0.95rem',
      marginTop: '0.2rem',
    },
    statusBox: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.8rem',
      backgroundColor: '#f1f2f6',
      padding: '0.6rem 1.2rem',
      borderRadius: '20px',
      fontSize: '0.8rem',
      fontWeight: '600',
      color: '#4b6584',
    },
    pulseDot: {
      width: '8px',
      height: '8px',
      backgroundColor: '#2ecc71',
      borderRadius: '50%',
      boxShadow: '0 0 8px rgba(46, 204, 113, 0.6)',
    },
    metricsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1rem',
      marginBottom: '2rem',
    },
    metricCard: {
      backgroundColor: '#ffffff',
      padding: '1.5rem',
      borderRadius: '12px',
      borderTop: '3px solid #3498db',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.04)',
    },
    mainContent: {
      width: '100%', // Changed to full width
    },
    panel: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '1.5rem',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    },
    panelTitle: {
      fontSize: '1.1rem',
      fontWeight: '700',
      marginBottom: '1.5rem',
      paddingBottom: '0.8rem',
      borderBottom: '1px solid #f1f2f6',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    th: {
      textAlign: 'left',
      fontSize: '0.75rem',
      color: '#bdc3c7',
      padding: '1rem 0.5rem',
      borderBottom: '2px solid #f1f2f6',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    td: (isHovered) => ({
      padding: '1.2rem 0.5rem',
      borderBottom: '1px solid #f9f9f9',
      fontSize: '0.9rem',
      backgroundColor: isHovered ? '#fffdfa' : 'transparent',
      transition: 'all 0.2s ease',
    }),
    riskBadge: (level) => ({
      fontWeight: '700',
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '0.75rem',
      backgroundColor: level === 'High' ? '#fff0f0' : level === 'Moderate' ? '#fff9eb' : '#f0fff4',
      color: level === 'High' ? '#e74c3c' : level === 'Moderate' ? '#f39c12' : '#27ae60',
    }),
  };

  if (loading) return <div style={{...s.container, textAlign: 'center', paddingTop: '10%'}}>Analyzing Epidemiological Lags...</div>;
  if (!data) return <div style={{...s.container, color: 'red'}}>Could not load report.</div>;

  return (
    <div style={s.container}>
      {/* Header */}
      <div style={s.bulletinHeader}>
        <div>
          <span style={s.badge}>Official Intelligence Bulletin</span>
          <h1 style={s.title}>Weekly Disease Forecast: Week {data.metadata.week}, {data.metadata.year}</h1>
          <p style={s.subtitle}>Comprehensive Prediction Matrix Across All Districts</p>
        </div>
        <div style={s.statusBox}>
          <div style={s.pulseDot}></div>
          <span>LIVE DATA FEED</span>
        </div>
      </div>

      {/* National Overview Cards */}
      <div style={s.metricsGrid}>
        {diseaseNames.map(disease => {
          const total = data.districts.reduce((acc, curr) => acc + (curr.breakdown[disease] || 0), 0);
          return (
            <div key={disease} style={s.metricCard}>
              <p style={{fontSize: '0.75rem', fontWeight: '600', color: '#95a5a6', textTransform: 'uppercase'}}>{disease}</p>
              <h4 style={{fontSize: '1.8rem', fontWeight: '800', margin: '0.5rem 0'}}>{total}</h4>
              <p style={{fontSize: '0.7rem', color: '#3498db', fontWeight: '600'}}>National Prediction</p>
            </div>
          );
        })}
      </div>

      <div style={s.mainContent}>
        <div style={s.panel}>
          <h3 style={s.panelTitle}>District Disease Projections</h3>
          <div style={{overflowX: 'auto'}}>
            <table style={s.table}>
              <thead>
                <tr>
                  <th style={s.th}>District</th>
                  {diseaseNames.map(name => (
                    <th key={name} style={s.th}>{name}</th>
                  ))}
                  <th style={s.th}>Total Cases</th>
                  <th style={s.th}>Overall Risk</th>
                </tr>
              </thead>
              <tbody>
                {data.districts.map(d => (
                  <tr 
                    key={d.district} 
                    onMouseEnter={() => setHoveredRow(d.district)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    <td style={{...s.td(hoveredRow === d.district), fontWeight: '600'}}>{d.district}</td>
                    
                    {/* Disease Columns */}
                    {diseaseNames.map(name => (
                      <td key={name} style={s.td(hoveredRow === d.district)}>
                        {d.breakdown[name] || 0}
                      </td>
                    ))}

                    <td style={{...s.td(hoveredRow === d.district), fontWeight: '700'}}>{d.total}</td>
                    <td style={s.td(hoveredRow === d.district)}>
                      <span style={s.riskBadge(d.risk)}>{d.risk}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiseaseIntelligence;