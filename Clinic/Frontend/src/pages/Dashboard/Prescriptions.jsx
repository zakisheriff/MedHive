import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './css/Prescriptions.css';

const Prescriptions = () => {
  const [orders, setOrders] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [medicineStatuses, setMedicineStatuses] = useState({}); // Persist statuses across refreshes

  // Fetch prescriptions from backend
  const fetchPrescriptions = async () => {
    try {
      const response = await fetch('http://localhost:5002/api/prescriptions/incoming');
      const data = await response.json();

      if (response.ok) {
        // Transform backend data to match frontend format
        const transformedOrders = data.prescriptions.map(prescription => {
          // Parse medicines from JSONB
          let medicines = [];
          try {
            medicines = prescription.has_extracted_data && prescription.medicines
              ? (typeof prescription.medicines === 'string'
                ? JSON.parse(prescription.medicines)
                : prescription.medicines)
              : [];
          } catch (e) {
            console.error('Failed to parse medicines:', e);
          }

          // Format medicines for display
          const formattedMedicines = medicines.map((med, index) => {
            const statusKey = `${prescription.id}-${index}`;
            return {
              name: `${med.name} ${med.dosage || ''}`.trim(),
              quantity: med.duration || med.frequency || '',
              status: medicineStatuses[statusKey] || null // Restore previous status
            };
          });

          // If no extracted data, show manual review required
          if (!prescription.has_extracted_data || formattedMedicines.length === 0) {
            const statusKey = `${prescription.id}-0`;
            formattedMedicines.push({
              name: 'Manual Review Required',
              quantity: 'AI extraction unavailable',
              status: medicineStatuses[statusKey] || null
            });
          }

          return {
            id: prescription.id,
            patientName: prescription.patient_name,
            medHiveId: prescription.medhive_id,
            profilePic: prescription.medhive_id.startsWith('@mh') ? '/icons/male.jpg' : '/icons/female.jpg',
            dateTime: new Date(prescription.received_at).toLocaleString('en-US', {
              weekday: 'short',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }),
            image: prescription.prescription_image_url,
            medicines: formattedMedicines
          };
        });

        setOrders(transformedOrders);
      }
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch and auto-refresh every 10 seconds
  useEffect(() => {
    fetchPrescriptions();
    const interval = setInterval(fetchPrescriptions, 10000); // 10 seconds
    return () => clearInterval(interval);
  }, [medicineStatuses]); // Re-fetch when statuses change

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setSelectedImage(null);
      }
    };

    if (selectedImage) {
      window.addEventListener('keydown', handleEsc);
    }

    return () => {
      window.removeEventListener('keydown', handleEsc);
    }
  }, [selectedImage]);

  const toggleStatus = (orderId, medIndex, newStatus) => {
    const statusKey = `${orderId}-${medIndex}`;

    // Update persistent status storage
    setMedicineStatuses(prev => ({
      ...prev,
      [statusKey]: prev[statusKey] === newStatus ? null : newStatus
    }));

    // Update UI immediately
    setOrders(prev => prev.map(order =>
      order.id === orderId
        ? {
          ...order,
          medicines: order.medicines.map((med, i) =>
            i === medIndex
              ? { ...med, status: med.status === newStatus ? null : newStatus }
              : med
          )
        }
        : order
    ));
  };

  const handleDispense = async (orderId) => {
    try {
      const response = await fetch(`http://localhost:5002/api/prescriptions/${orderId}/dispense`, {
        method: 'PATCH'
      });

      if (response.ok) {
        // Remove from UI
        setOrders(prev => prev.filter(order => order.id !== orderId));
      } else {
        console.error('Failed to dispense prescription');
      }
    } catch (error) {
      console.error('Error dispensing prescription:', error);
    }
  };

  if (loading) {
    return (
      <div className="prescriptions-container">
        <h1 className="page-heading">Incoming Prescriptions</h1>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>Loading prescriptions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="prescriptions-container">
      <h1 className="page-heading">Incoming Prescriptions</h1>

      <div className="orders-list">
        <AnimatePresence>
          {orders.length > 0 ? (
            orders.map((order) => (
              <motion.div
                key={order.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="order-card"
              >
                {/* 1. CARD HEADER: Profile and Time */}
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

                {/* 2. CARD BODY: Image and Meds */}
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

                {/* 3. CARD FOOTER: Dispense */}
                <div className="card-footer">
                  <button className="dispense-main-btn" onClick={() => handleDispense(order.id)}>
                    Dispense Order
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            /* EMPTY STATE: Only shows when orders.length is 0 */
            <motion.div
              className="empty-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              key="empty"
            >
              <div className="empty-icon-container">
                <img src="/icons/no-pres.png" alt="Done" className="empty-icon" />
              </div>
              <h2>No prescriptions yet</h2>
              <p>New orders from patients will appear here in real-time.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* FULLSCREEN IMAGE MODAL */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="image-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button className="close-modal" onClick={() => setSelectedImage(null)}>
              ✕
            </button>
            <img src={selectedImage} alt="Full View" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Prescriptions;