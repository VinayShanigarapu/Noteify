import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom'; // Import useNavigate instead of useHistory
import '../assets/css/auth.css';
import SignupForm from './signup';
import { auth } from './firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Toast from './Toast';

export const LoginPage = ({user}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showSignup, setShowSignup] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [showPassword, setShowPassword] = useState(false);


  const handleLogin = async (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(
        auth,
        email,
        password
      ).then((userCredential) =>{
        const user = userCredential.user;
        console.log(user);
      }).catch((error) => {
        const errorCode = error.code;
        const errorMsg = error.message;
        console.log(errorCode,errorMsg);
        setShowErrorToast(true);
      })
  };

  const toggleSignup = () => {
    setShowSignup((prev) => !prev);
  };
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  if(user){
    return <Navigate to='/home'></Navigate>
  }
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
  return (
    <center><div id="form-ui">
      <div id="welcome-lines">
          <div id="welcome-line-1">
            {showSignup && <h2 id="heading">Register</h2>}
            {!showSignup && <h2 id="heading">Login</h2>}
          </div>
          <div id="welcome-line-2">Welcome Back</div>
        </div>
      {showSignup ? (
        <SignupForm />
      ) : (
    <form id="form" onSubmit={handleLogin}>
      <div id="form-body">
        <div id="input-area">
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
          <button id="submit-button" type="submit">Sign In</button>
        </div> 
      </div>
      {showErrorToast && (
          <Toast message="Invalid Email or Password!!!" toastType="danger" duration={5000} />
        )}
    </form>
      )}
      <div id="toggle">
            <p>
            {showSignup
              ? 'Already have an account?'
              : "Don't have an account?"}{' '}
            <u><a id='toggle-button' onClick={toggleSignup}>
              {showSignup ? 'SignIn' : 'SignUp'}
            </a></u>
          </p>
        </div>
    </div></center>
  );
};
