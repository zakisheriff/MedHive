import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './css/Prescriptions.css';

const Prescriptions = () => {
  const [orders, setOrders] = useState([
    {
      id: 1,
      patientName: "Abdul Raheem",
      medHiveId: "@mh001",
      profilePic: "https://i.pravatar.cc/150?u=mh001",
      dateTime: "Wed, July 12, 2023 06:12 PM",
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
      medHiveId: "@mh042",
      profilePic: "https://i.pravatar.cc/150?u=mh042",
      dateTime: "Wed, July 12, 2023 08:45 PM",
      image: "/prescription-sample-2.jpg",
      medicines: [
        { name: "Paracetamol 500mg", quantity: "x 5 Days", status: null }
      ]
    }
  ]);

  const [selectedImage, setSelectedImage] = useState(null);

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
      <h1 className="page-heading">Incoming Prescriptions</h1>

      <div className="orders-list">
        <AnimatePresence>
          {orders.map((order) => (
            <motion.div 
              key={order.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="order-card"
            >
              {/* CARD HEADER: Profile and Time */}
              <div className="card-header">
                <div className="header-left">
                  <img src={order.profilePic} className="patient-avatar" alt="profile" />
                  <div className="patient-info">
                    <span className="name">{order.patientName}</span>
                    <span className="mh-id">{order.medHiveId}</span>
                  </div>
                </div>
                <div className="header-right">
                  <span className="timestamp">{order.dateTime}</span>
                </div>
              </div>

              <hr className="header-divider" />

              {/* CARD BODY: Image and Meds */}
              <div className="card-body">
                <div className="image-side" onClick={() => setSelectedImage(order.image)}>
                  <img src={order.image} alt="Prescription" className="main-presc-img" />
                  <div className="view-overlay">CLICK TO VIEW</div>
                </div>

                <div className="details-side">
                  <div className="meds-list">
                    {order.medicines.map((med, index) => (
                      <div key={index} className="med-row">
                        <div className="med-text">
                          <strong>{med.name}</strong>
                          <span className="qty">{med.quantity}</span>
                        </div>
                        <div className="status-btns">
                          <button 
                            className={`btn-state avail ${med.status === 'available' ? 'active' : ''}`}
                            onClick={() => toggleStatus(order.id, index, 'available')}
                          >
                            Available
                          </button>
                          <button 
                            className={`btn-state unavail ${med.status === 'unavailable' ? 'active' : ''}`}
                            onClick={() => toggleStatus(order.id, index, 'unavailable')}
                          >
                            Not Available
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* CARD FOOTER: Dispense */}
              <div className="card-footer">
                <button className="dispense-main-btn" onClick={() => handleDispense(order.id)}>
                  Dispense Order
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Modal remains same for full viewing */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div className="image-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button className="close-modal" onClick={() => setSelectedImage(null)}>&times;</button>
            <img src={selectedImage} alt="Full View" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Prescriptions;