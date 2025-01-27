import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import chatbgimg from '../images/cute-text-messages-mobile-phone-screen-media-mix.jpg';
import chatapplogo from '../images/25540.jpg';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {

  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/chat-room'); // Navigate to /chat-room
  };
  return (
    <div className="container">
      <nav className="navbar">
        <div className="logo">
          <img src={chatapplogo} alt="Logo" className="logo-img" />
          <h1 className="brand-name">ChatMaster</h1>
        </div>
        <div className="navbar-links">
          {/* Use Link for navigation */}
          <Link to="/">Home</Link>
          <Link to="/chat-room">Chat Room</Link>
        </div>
      </nav>

      <div className="hero-section">
        <img src={chatbgimg} alt="Background" className="background-img" />
        <div className="hero-content">
          <h2>Welcome to Real-Time Chatting</h2>
          <p>Connect, Chat, and Share in a safe space!</p>
          <p onClick={handleNavigate} style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}>
      Join Chat Room
    </p>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
