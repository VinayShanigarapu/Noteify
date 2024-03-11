import { Link } from 'react-router-dom';
import '../assets/css/auth.css';
import '../assets/css/home.css';

export const Home = () => {  
    return (
      <div className='main'>
        <div className="bar">
          <div className="bar-wrapper container">
            <span className="bar-logo">Noteify</span>
            <div className="bar-options">
              <Link to="/login" className="bar-option">Login</Link>
              <Link to="/contactus" className="bar-option">Contact Us</Link>
            </div>
          </div>
        </div>
        <div className='des'>
          <h1>Elevate your note-taking experience with our vibrant and personalized Notes platform.</h1>
          <p>Express your unique style with a variety of stunning palette options. Seamlessly create, edit, and organize your notes with an intuitive interface. Welcome to a space where creativity and organization come together effortlessly!</p>
        </div>
      </div>
    );
};
