import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom'; // Import useNavigate instead of useHistory
import { auth } from './firebase';
import '../assets/css/auth.css';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import Toast from './Toast';

const SignupForm = ({user}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [showPassword, setShowPassword] = useState(false);



  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      // Create a new user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Update the user's display name
      await updateProfile(userCredential.user, {
        displayName: `${firstName} ${lastName}`,
      });

      console.log('User Created Successfully!!', userCredential.user);
    } catch (error) {
      console.error('Error during Signup', error.message);
      setShowErrorToast(true);
    }
  };
  useEffect(() => {
    if(showErrorToast){
      const timer = setTimeout(() =>{
        setShowErrorToast(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showErrorToast]);

  if(user){
    return <Navigate to='/home'></Navigate>
  }
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  return (
      <form id="form" onSubmit={handleSignup}>
      <div id="form-body">
      <div id="input-area">
          <div className="form-inp">
            <input
              type="text"
              placeholder="Enter your first name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className="form-inp">
              <input
                type="text"
                placeholder="Enter your last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          <div className="form-inp">
          <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-inp">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className={`eye-icon ${showPassword ? 'visible' : ''}`}
              onClick={togglePasswordVisibility}
            >
              <i className={`fas ${showPassword ? 'fa-eye' : 'fa-eye-slash'}`}></i>
            </span>
          </div>
        </div>
          <div id="submit-button-cvr">
            <button id="submit-button" type="submit">Sign Up</button>
          </div>
        </div>
        {showErrorToast && (
          <Toast message="Credentials Already Exists!!!" toastType="danger" duration={5000} />
        )}
    </form>
  );  
};

export default SignupForm;
