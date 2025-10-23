import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import email_icon from '../Assets/email.png';
import password_icon from '../Assets/password.png';
import { Link } from 'react-router-dom';


const LoginComp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:4444/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.token) {
        localStorage.setItem('token', data.token);
        navigate('/');
        window.location.reload();

      } else {
        console.error('Ошибка авторизации:', data.message);
      }
    } catch (error) {
      console.error('Ошибка сети:', error);
    }
  };

  return (
    <div className='reg_page'>
      <div className="container">
        <div className='title'>
          <div className='text'>Sign in</div>
          <div className='underline'></div>
        </div>
        <div className='inputs'>
          <div className='login_input_container'>
            <img className="icons" src={email_icon} alt="Email Icon" />
            <input
              className='login_input'
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />
          </div>
          <div className='login_input_container'>
            <img className="icons"  src={password_icon} alt="Password Icon" />
            <input className='login_input'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
          </div>
          <button className='log_btn' onClick={handleLogin}><span className='btn_lbl'>Log In</span></button>
          <p>don't have account? <Link to='/register'>sign up</Link></p>
        </div>

      </div>
    </div>
  );
};

export default LoginComp;
