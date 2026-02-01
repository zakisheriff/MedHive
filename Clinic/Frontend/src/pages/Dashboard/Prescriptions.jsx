import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './css/Prescriptions.css';

const Prescriptions = () => {
  // Initial state mimicking incoming orders from a mobile app
  const [orders, setOrders] = useState([
    {
      id: 1,
      patientName: "Abdul Raheem",
      image: "/prescription-sample-1.jpg",
      medicines: [
        { name: "Amoxicillin 500mg", quantity: "x 7 Days", status: null },
        { name: "Sitricin 200mg", quantity: "x 3 days", status: null },
        { name: "Loridin 100mg", quantity: "x 10 days", status: null }
      ]
    },
    {
      id: 2,
      patientName: "Sarah Firthouse",
      image: "/prescription-sample-2.jpg",
      medicines: [
        { name: "Paracetamol 500mg", quantity: "x 5 Days", status: null }
      ]
    }
  ]);

  const [selectedImage, setSelectedImage] = useState(null);

  // Update availability (This data would be sent to History/Database later)
  const toggleStatus = (orderId, medIndex, status) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, medicines: order.medicines.map((med, i) => i === medIndex ? { ...med, status } : med) }
        : order
    ));
  };

  // Remove the order from queue (Dispense)
  const handleDispense = (orderId) => {
    setOrders(prev => prev.filter(order => order.id !== orderId));
  };

  return (
    <div className="prescriptions-container">
      <h1 className="page-heading">Incoming Prescriptions</h1>

      <div className="orders-list">
        <AnimatePresence>
          {orders.map((order) => (
            <motion.div 
              key={order.id}
              layout
              initial={{ opacity: 0, scale: 1.0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: 0 }}
              className="order-card"
            >
              <div className="order-header">{order.patientName}</div>
              
              <div className="order-body">
                {/* Prescription Image Preview */}
                <div className="image-preview-container" onClick={() => setSelectedImage(order.image)}>
                  <img src={order.image} alt="Prescription" className="order-img" />
                  <div className="zoom-overlay">Click to View</div>
                </div>

                {/* Medicine List */}
                <div className="medicines-column">
                  {order.medicines.map((med, index) => (
                    <div key={index} className="medicine-row">
                      <span className="med-info"><strong>{med.name}</strong> {med.quantity}</span>
                      <div className="status-buttons">
                        <button 
                          className={`status-btn available ${med.status === 'available' ? 'active' : ''}`}
                          onClick={() => toggleStatus(order.id, index, 'available')}
                        >
                          Available
                        </button>
                        <button 
                          className={`status-btn unavailable ${med.status === 'unavailable' ? 'active' : ''}`}
                          onClick={() => toggleStatus(order.id, index, 'unavailable')}
                        >
                          Not Available
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="order-footer">
                <button className="dispense-btn" onClick={() => handleDispense(order.id)}>
                  DISPENSE
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Fullscreen Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            className="image-modal"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <button className="close-modal" onClick={() => setSelectedImage(null)}>&times;</button>
            <img src={selectedImage} alt="Full Prescription" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Prescriptions;