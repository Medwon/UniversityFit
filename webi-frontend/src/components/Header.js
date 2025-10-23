import React from 'react';
import './Header.css';
import { Link } from 'react-router-dom';

const Header = ({ user , currencyBalance }) => {
  const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  let avatarContent;
  if (user && user.avatarUrl) {
    avatarContent = (
      <img src={`http://localhost:4444${user.avatarUrl}`} alt="Avatar" className="avatar-mini" width="40" height="40"/>
    );
  } else {
    avatarContent = (
      <img src={'http://localhost:4444/uploads/User-avatar.svg.png'} alt="Avatar" className="avatar-mini"/>
    );
  }
  return (
    <header className="header">
      <div className="wrapper">
        <div className="logo"><Link className='logo' to={'/'}>WEBI</Link></div>
        <div className="tools_container">
          <Link className="tools" to='/leaderboard'><p>Leaderboard</p></Link>
          <Link className="tools" to='/universities'><p>Universities</p></Link>
          <Link className="tools" to='/posts'><p>Posts</p></Link>
          <Link className="tools" to='/gpacalc'><p>GPA</p></Link>
        </div>
        <div className='profile_mini_container'>
          <div className="profile_mini">
            <Link to="/profile">
            {avatarContent}
            </Link>
          </div>
          <button className='exit_btn' onClick={logout}><img className="exit_img" src='https://cdn-icons-png.flaticon.com/512/10233/10233766.png'/></button>

        </div>
      </div>
    </header>
  );
};

export default Header;
