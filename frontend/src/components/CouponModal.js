// CouponModal.js
import React from 'react';

const CouponModal = ({ show, onClose, message }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="modal" style={modalStyles}>
      <div className="modal-content" style={modalContentStyles}>
        <span className="close" onClick={onClose} style={closeStyles}>&times;</span>
        <h2>🎉 Congratulations! 🎉</h2>
        <p>{message || "You've earned a special coupon!"}</p>
        <div className="coupon-code">
          <strong>Your Coupon Code: </strong><span className="code">COUPONCODE123</span>
        </div>
        <button className="apply-coupon-button" onClick={onClose} style={buttonStyles}>Apply Coupon</button>
      </div>
    </div>
  );
};

const modalStyles = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'fixed',
  zIndex: '1',
  left: '0',
  top: '0',
  width: '100%',
  height: '100%',
  overflow: 'auto',
  backgroundColor: 'rgba(0, 0, 0, 0.6)' // Darken the background
};

const modalContentStyles = {
  backgroundColor: '#fff',
  margin: '10% auto',
  padding: '30px',
  borderRadius: '8px', // Rounded corners
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Drop shadow for a better effect
  width: '80%',
  maxWidth: '400px', // Set a maximum width
  textAlign: 'center'
};

const closeStyles = {
  color: '#aaa',
  float: 'right',
  fontSize: '28px',
  fontWeight: 'bold',
  cursor: 'pointer' // Pointer cursor for the close button
};

const buttonStyles = {
  backgroundColor: '#28a745',
  color: 'white',
  padding: '10px 20px',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '16px',
  marginTop: '20px'
};

export default CouponModal;


