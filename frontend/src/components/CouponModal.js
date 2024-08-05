// frontend/src/components/CouponModal.js
import React from 'react';

const CouponModal = ({ show, onClose }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="modal" style={modalStyles}>
      <div className="modal-content" style={modalContentStyles}>
        <span className="close" onClick={onClose} style={closeStyles}>&times;</span>
        <h2>Congratulations!</h2>
        <p>You've earned a $10 coupon: COUPONCODE123</p>
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
  backgroundColor: 'rgba(0, 0, 0, 0.4)'
};

const modalContentStyles = {
  backgroundColor: '#fefefe',
  margin: '15% auto',
  padding: '20px',
  border: '1px solid #888',
  width: '80%',
  textAlign: 'center'
};

const closeStyles = {
  color: '#aaa',
  float: 'right',
  fontSize: '28px',
  fontWeight: 'bold'
};

export default CouponModal;
