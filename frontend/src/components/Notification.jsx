import React, { useEffect } from "react";

const Notification = ({ message, type, onClose }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000); // 2 seconds
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;
  return (
    <div className={`fixed top-6 right-6 z-50 px-6 py-3 rounded shadow-lg text-white font-semibold transition-all duration-300 ${type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}
         style={{ minWidth: 200 }}>
      <span>{message}</span>
      <button className="ml-4 text-lg font-bold" onClick={onClose}>&times;</button>
    </div>
  );
};

export default Notification;
