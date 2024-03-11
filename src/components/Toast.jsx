import React, { useEffect, useState } from 'react';
import '../assets/css/toast.css'; // Import the CSS file for styling

const Toast = ({ message, toastType, duration = 5000 }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => {
      clearTimeout(timer);
    };
  }, [duration]);

  const icon = {
    success: '<span><i class="fa fa-check" aria-hidden="true"></i><span>',
    danger: '<span><i class="fa fa-exclamation-triangle" aria-hidden="true"></i></span>',
    warning: '<span><i class="fa fa-exclamation-circle" aria-hidden="true"></i></span>',
  };

  return (
    <div className={`toast toast-${toastType} ${isVisible ? 'show' : 'closing'}`}>
      <div className="toast-content-wrapper">
        <div className="toast-icon" dangerouslySetInnerHTML={{ __html: icon[toastType] }}></div>
        <div className="toast-message">{message}</div>
        <div className="toast-progress"></div>
      </div>
    </div>
  );
};

export default Toast;
