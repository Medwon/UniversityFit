import React from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';


const Footer = () => {
  return (
    <footer className="footerWebi">
      <div className="footerWebi-container">
        <div className="footerWebi-logo">
          <Link to='/'><span className="footerWebi-logoText">WEBI</span></Link>
        </div>
        <div className="footerWebi-links">
          <Link to="/leaderboard" className="footerWebi-link">Leaderboard</Link>
          <Link to="/universities" className="footerWebi-link">Universities</Link>
          <Link to="/posts" className="footerWebi-link">Posts</Link>
          <Link to="/gpacalc" className="footerWebi-link">GPA</Link>
          <Link to="/profile" className="footerWebi-link">Profile</Link>

        </div>
      </div>
      <div className="footerWebi-bottom">
        <p>© {new Date().getFullYear()} Webi. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
