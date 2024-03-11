import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Home } from '../src/components/Home';
import { LoginPage } from '../src/components/login';
import { ContactUs } from '../src/components/contactus';
import App from './App'; // Import App as the default export
import { ProtectedRoute } from '../src/components/protectedRoute';
import "./assets/css/global.css";
import { PaletteProvider } from "./context/PaletteContext";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./components/firebase";
import React, { useEffect, useState } from 'react';
import './assets/css/loader.css';

function Main() {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
      setAuthChecked(true); // Mark authentication check as completed
    });

    return () => unsubscribe();
  }, []);

  if (!authChecked) {
    // Show loading spinner or message until authentication check is complete
    return <div className="loader"></div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        {!user ? (
          <>
            <Route index path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage user={user} />} />
            <Route path="/contactus" element={<ContactUs />} />
            {/* Add a redirect route to home if no other route matches */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        ) : (
          <>
            <Route path="/home" element={<ProtectedRoute user={user}><App /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/home" />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <PaletteProvider>
      <Main />
    </PaletteProvider>
  </React.StrictMode>
);
