import React, { useEffect, useState } from 'react';
import './FirstSection.css';
import News from './News.js';
import { Link } from 'react-router-dom';

const FirstSection = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await fetch('http://localhost:4444/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (data) {
          setUser(data); // Устанавливаем данные пользователя
        }
      }
    };

    fetchUser();
  }, []);
  let avatarContent;
  if (user && user.avatarUrl) {
    avatarContent = (
      <img src={`http://localhost:4444${user.avatarUrl}`} alt="Avatar" className="profile_pic_img"/>
    );
  } else {
    avatarContent = (
      <img src={'http://localhost:4444/uploads/User-avatar.svg.png'} alt="Avatar" className="profile_pic_img"/>
    );
  }

  return (
    <div className="first_section">
      <Link to={'/profile'} className="profile">
        <div className="profile_pic">
          {avatarContent}
        </div>
        <Link to={'/login'} className="profile_name">
          {user ? user.fullName : <Link to="/login">Войдите в систему</Link>}
        </Link>
      </Link>
      <div className="news_section">
        <p style={{marginLeft: '50px', fontSize: '24px', fontWeight: '700'}}>NEWS</p>
        <News />
      </div>
    </div>
  );
};

export default FirstSection;
