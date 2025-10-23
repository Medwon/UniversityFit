import React, { useState } from 'react';
import './Register.css';
import email_icon from '../Assets/email.png';
import password_icon from '../Assets/password.png';
import person_icon from '../Assets/person.png';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const RegisterComp = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:4444/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName,
          email,
          password,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Регистрация успешна!');
        navigate('/');

      } else {
        alert(data.message || 'Error. Password must include more than 8 charachters)');
      }
    } catch (error) {
      console.error('Ошибка:', error);
      alert('Ошибка при регистрации');
    }
  };

  return (
    <div className='reg_page'>
      <div className="register_container">
        <div className='title'>
          <div className='text'>Sign up</div>
          <div className='underline'></div>
        </div>
        <form onSubmit={handleRegister} className='inputs'>
          <div className='login_input_container'>
            <img className="icons" src={person_icon} alt="icon" />
            <input 
             maxLength={20}
              type='text' 
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required 
              className='login_input'

            />
          </div>
          <div className='login_input_container'>
            <img className="icons" src={email_icon} alt="icon" />
            <input 
              type='email' 
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              className='login_input'
            />
          </div>
          <div className='login_input_container'>
            <img className="icons" src={password_icon} alt="icon" />
            <input 
              className='login_input'
              type='password' 
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <button type="submit" className='log_btn'><span className='btn_lbl'>Sign up</span></button>
          <p>have account? <Link to='/login'>login</Link></p>
        </form>
      </div>
    </div>
  );    
};

export default RegisterComp;
