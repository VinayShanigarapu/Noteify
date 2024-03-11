import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from './firebase';
import { signOut } from 'firebase/auth';
import "../assets/css/navbar.css";
import Toast from './Toast';


export const Navbar = ({
  setOpen,
  state,
  dispatch,
  palettes,
  currentPalette,
  setCurrentPalette,
}) => {
  const [onPalette, setOnPalette] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);


  const handlePalette = (item) => {
    setCurrentPalette(item);
    dispatch({ type: "SET_PALETTE", payload: item });
    setOnPalette(false);
  };
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [firstName, setFirstName] = useState('');

  useEffect(() => {
    // Get the first name from the display name
    setFirstName(getFirstLetter(auth.currentUser?.displayName));
  }, []);

  const handleLogout = async () => {
    try {
      // Sign out the user
      await signOut(auth);
      console.log('Logged Out Successfully!');
      navigate('/');
    } catch (error) {
      setShowErrorToast(true);
      console.error('Error during logout:', error.message);
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

  const toggleProfile = () => {
    setShowProfile((prev) => !prev);
  };

  const getFirstLetter = (str) => str?.charAt(0).toUpperCase();

  return (
    <div
      className={`navbar ${
        state?.palette ? state?.palette?.name : currentPalette?.name
      }`}
    >
      <div className="nav-wrapper container">
        <span className="logo">Noteify</span>
        <div className="nav-options">
          <div className="nav-icon">
            <div className={`palettes ${onPalette && "active"}`}>
              {palettes.map((palette) => (
                <div
                  onClick={() => handlePalette(palette)}
                  key={palette?.id}
                  style={{ backgroundColor: `${palette?.color}` }}
                  className={`palette-item ${
                    currentPalette?.id === palette?.id && "active"
                  }`}
                ></div>
              ))}
            </div>
            <i
              onClick={() => setOnPalette((prev) => !prev)}
              className="fa-solid fa-circle-half-stroke"
            ></i>
          </div>
          <div className="profile-container" onClick={toggleProfile}>
            <div className="profile-circle">{firstName}</div>
          </div>
          {showProfile && (
            
            <div className="profile-details">
              <center><label className='title'>Profile</label></center>
              <center><div className="photo"> 
                <div className="photo-container"></div> 
              </div> </center>
              <center><p className='name'>{auth.currentUser?.displayName}</p></center>
              <center><p className='mail'>{auth.currentUser?.email}</p></center>
              <center><button onClick={handleLogout}>Logout</button></center>
            </div>
          )}
          <div className="nav-icon-add" onClick={() => setOpen(true)}>
            <i className="fa-solid fa-plus"></i>
          </div>
        </div>
      </div>
      {showErrorToast && (
          <Toast message="Something went wrong while logout!!" toastType="danger" duration={5000} />
      )}
    </div>
  );
};
