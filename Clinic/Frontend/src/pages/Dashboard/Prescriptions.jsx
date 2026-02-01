import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './css/Prescriptions.css';

const Prescriptions = () => {
  const [orders, setOrders] = useState([
    {
      id: 1,
      patientName: "Abdul Raheem",
      medHiveId: "@mh001",
      image: "/prescription-sample-1.jpg",
      medicines: [
        { name: "Amoxicillin 500mg", quantity: "x 7 Days", status: null },
        { name: "Sitricin 200mg", quantity: "x 3 days", status: null }
      ]
    },
    {
      id: 2,
      patientName: "Sarah Firthouse",
      medHiveId: "@mh042",
      image: "/prescription-sample-2.jpg",
      medicines: [
        { name: "Paracetamol 500mg", quantity: "x 5 Days", status: null }
      ]
    }
  ]);

  const toggleStatus = (orderId, medIndex, status) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, medicines: order.medicines.map((med, i) => i === medIndex ? { ...med, status } : med) }
        : order
    ));
  };

  const handleDispense = (orderId) => {
    setOrders(prev => prev.filter(order => order.id !== orderId));
  };

  return (
    <div className="prescriptions-container">
      <header className="page-header">
        <h1>Incoming Prescriptions</h1>
      </header>

      <div className="orders-feed">
        <AnimatePresence>
          {orders.map((order) => (
            <motion.div 
              key={order.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="prescription-card"
            >
              {/* Left Side: Full Height Image Area */}
              <div className="prescription-image-area">
                <img src={order.image} alt="Prescription" />
              </div>

              {/* Right Side: Content Area */}
              <div className="prescription-content">
                <div className="patient-meta">
                  <span className="name">{order.patientName}</span>
                  <span className="handle">{order.medHiveId}</span>
                </div>

                <div className="medicine-list">
                  {order.medicines.map((med, index) => (
                    <div key={index} className="med-row">
                      <p className="med-text"><strong>{med.name}</strong> • {med.quantity}</p>
                      <div className="btn-group">
                        <button 
                          className={`action-btn avail ${med.status === 'available' ? 'active' : ''}`}
                          onClick={() => toggleStatus(order.id, index, 'available')}
                        >
                          Available
                        </button>
                        <button 
                          className={`action-btn unavail ${med.status === 'unavailable' ? 'active' : ''}`}
                          onClick={() => toggleStatus(order.id, index, 'unavailable')}
                        >
                          Not Available
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="card-footer">
                  <button className="dispense-main-btn" onClick={() => handleDispense(order.id)}>
                    Dispense Order
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Prescriptions;