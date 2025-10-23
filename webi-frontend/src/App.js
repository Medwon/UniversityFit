import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Register from './pages/Register';
import Home from './pages/Home';
import Login from './pages/Login';
import UniversityList from './components/UniversityList';
import './App.css';
import Profile from './components/Profile';
import Leaderboard from './pages/Leaderboard.js'
import Posts from './components/Posts.js';
import CreatePost from './components/CreatePost.js';
import PostDetails from './components/PostDetails.js';
import Gpa from './components/Gpacalc.js';
import axios from 'axios';
import Footer from './components/Footer.js';
function App() {
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [currencyBalance, setCurrencyBalance] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get('http://localhost:4444/auth/me', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setCurrentUser(response.data);
      } catch (error) {
        console.error("Couldn't fetch current user:", error);
      }
    };
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserData(token);
      fetchFavorites(token);
    }
  }, []);

  const fetchUserData = async (token) => {
    try {
      const response = await fetch('http://localhost:4444/auth/me', { // Убедитесь, что указан полный URL
        headers: {
          Authorization: `Bearer ${token}`, // Исправление: добавлены обратные кавычки
        },
      });
  
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setCurrencyBalance(userData.currencyBalance || 0);
      } else {
        console.log('Ошибка на сервере:', await response.text()); // Выводим текст ответа сервера
      }
    } catch (error) {
      console.log('Error fetching user data:', error);
    }
  };

  const fetchFavorites = async (token) => {
    try {
      const response = await fetch('http://localhost:4444/favorites', { 
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });
  
      if (response.ok) {
        const favoritesData = await response.json();
        setFavorites(favoritesData);
      } else {
        console.log('Ошибка на сервере:', await response.text()); // Выводим текст ответа сервера
      }
    } catch (error) {
      console.log('Error fetching favorites:', error);
    }
  };

  const addFavorite = async (university) => {
    if (!user) return;
    const isAlreadyFavorited = favorites.some(
      (fav) => fav.name === university.name && fav.country === university.country
    );
  
    if (isAlreadyFavorited) {
      alert("Университет уже добавлен в избранное");
      return;
    }
  
    try {
      const response = await fetch('http://localhost:4444/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(university),
      });
      if (response.ok) {
        const updatedFavorites = await response.json();
        setFavorites(updatedFavorites);
        alert('Успешно добавлено');
      } else {
        const errorData = await response.json();
        console.log('Ошибка сервера:', errorData); 
      }
    } catch (error) {
      console.log('Ошибка при добавлении в избранное:', error);
    }
  };
  
  const removeFavorite = async (universityId) => {
    if (!user) return;
  
    try {
      const response = await fetch(`http://localhost:4444/favorites/${universityId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (response.ok) {
        setFavorites((prevFavorites) =>
          prevFavorites.filter((uni) => uni._id !== universityId)
        );
      }
    } catch (error) {
      console.log('Error removing favorite:', error);
    }
  };

  return (
    <Router>
      <div className='bg'>
        <div className='antifooter'>
        <Header user={user} currencyBalance={currencyBalance}/>
        <div className='smth'>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home user={user} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/universities" element={<UniversityList addFavorite={addFavorite} />} />
          <Route path="/profile"  element={<Profile user={user} setUser={setUser} favorites={favorites} removeFavorite={removeFavorite} />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/posts" element={<Posts currentUser={currentUser} />} />
          <Route path="/posts/:id" element={<PostDetails currentUser={currentUser} />} />
          <Route path="/gpacalc" element={<Gpa/>} />
        </Routes>
        </div>
      </div>

      <Footer/>
      </div>
    </Router>
  );
}

export default App;
