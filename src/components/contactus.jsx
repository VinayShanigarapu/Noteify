import React, { useState, useEffect } from 'react';
import '../assets/css/contactus.css';
import Toast from './Toast';

export const ContactUs = () => {

  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSuccessToast(true);
    e.target.reset();
  };

  // Use useEffect to reset showSuccessToast after displaying the toast
  useEffect(() => {
    if (showSuccessToast) {
      const timer = setTimeout(() => {
        setShowSuccessToast(false);
      }, 5000); // Adjust the duration to match your toast duration
      return () => clearTimeout(timer);
    }
  }, [showSuccessToast]);


  return (
    <section className="contact">
      <div className="content">
        <h2>Contact Us</h2>
        <p>
          Please use this form to get in touch with us, report a bug, or suggest a feature...
        </p>
      </div>
      <div className="contact-container">
        <div className="contactInfo">
              <div className="box">
                <div className="icon"><i className="fa fa-globe" aria-hidden="true"></i></div>
                  <div className="text">
                    <h3>Address</h3>
                    <p>MLR Institute of Technology, <br></br>Dundigal, Hyderabad, <br></br>500043</p>
                  </div>
              </div>
              <div className="box">
                  <div className="icon"><i className="fa fa-phone" aria-hidden="true"></i></div>
                    <div className="text">
                      <h3>Phone</h3>
                      <p>7995752702</p>
                  </div>
              </div>
              <div className="box">
                  <div className="icon"><i className="fa fa-envelope" aria-hidden="true"></i></div>
                  <div className="text">
                      <h3>Email</h3>
                      <p>vinayshanigarapu05@gmail.com</p>
                  </div>
              </div>
        </div>
        <div className="contactForm">
          <form onSubmit={handleSubmit}>
            <h2>Send Message</h2>
            <div className="inputBox">
                <input type="text" required></input>
                <span>Full Name</span>
            </div>
            <div className="inputBox">
                <input type="text" required></input>
                <span>Email</span>
            </div>
            <div className="inputBox">
                <textarea required></textarea>
                <span>Type your Message...</span>
            </div>
            <div className="inputBox">
                <input type="submit" value="Send"></input>
            </div>
          </form>
        </div>
      </div>
      {showSuccessToast && (
        <Toast message="Successfully Submited! Thanks for your response, we will contact you soon..." toastType="success" duration={5000} />
      )}
    </section>
  );
};
