import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';
import icon_save from '../Assets/tick.png';
const Profile = ({ user, setUser , favorites, removeFavorite }) => {
  const [avatar, setAvatar] = useState(user?.avatarUrl || "http://localhost:4444/uploads/User-avatar.svg.png");
  const [selectedFile, setSelectedFile] = useState(null);
  const [gpa, setGpa] = useState(user?.gpa || '');
  const [ielts, setIelts] = useState(user?.ielts || '');
  const [sat, setSat] = useState(user?.sat || '');
  const [errorMessage, setErrorMessage] = useState('');
  const [averages, setAverages] = useState({ gpa: 0, ielts: 0, sat: 0 });


  const handleUpdateProfile = async () => {
    if (gpa < 0 || gpa > 5) {
      setErrorMessage('GPA должен быть в пределах от 0 до 5');
      return;
    }
    if (ielts < 0 || ielts > 9 || ielts % 0.5!=0) {
      setErrorMessage('IELTS должен быть в пределах от 0 до 9(С шагом в 0.5)');
      return;
    }
    if (sat < 400 && sat!=0 || sat > 1600) {
      setErrorMessage('SAT должен быть в пределах от 400 до 1600');
      return;
    }

    try {
      const response = await axios.patch(
        'http://localhost:4444/profile/update',
        { gpa, ielts, sat },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setUser(response.data);
      setErrorMessage(''); 
      window.location.reload()
    } catch (error) {
      console.error("Ошибка обновления профиля:", error);
      alert('Не удалось обновить профиль');
    }
  };

  useEffect(() => {
    if (user) {
      setAvatar(user.avatarUrl);
    }
  }, [user]);
  useEffect(() => {
    const fetchAverages  = async () => {
        try {
            const response = await axios.get('http://localhost:4444/average');
            setAverages(response.data);
    } catch (error) {
            console.error("Ошибка получения средних значений:", error);
    }
};

fetchAverages();
}, []);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('avatar', selectedFile);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4444/profile/avatar', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setAvatar(data.avatarUrl);
        window.location.reload();
      } else {
        console.error('Ошибка загрузки аватара:', await response.text());
      }
    } catch (error) {
      console.error('Ошибка загрузки аватара:', error);
    }
  };
  

  if (!user) {
    return <p>Загрузка профиля...</p>;
  }

  return (
    <div className='Mainprofile_page_container'>
        <div className='Mainprofile_page'>
        <div className="Mainprofile">
          <div>
            {user.avatarUrl ? (
              <img className="profile_pic" src={`http://localhost:4444${user.avatarUrl}`} alt="Avatar" />
            ) : (
              <img className="profile_pic" src={`http://localhost:4444/uploads/User-avatar.svg.png`} alt="Avatar" />
            )}
            <div className="btn_container">
              <label className="custom-file-upload">
                <span className="btn_lbl">Загрузить</span>
                <input
                  type="file"
                  className="file-input"
                  onChange={handleFileChange}
                />
              </label>
              <button className="btn_save" onClick={handleUpload}>
                <img className="icon_save" src={icon_save} alt="Save icon" />
              </button>
            </div>
          </div>
          <div className="mainprofile_name">
            {user ? user.fullName : <a href="/login">Войдите в систему</a>}
            <p className="profile_email">{user.email}</p>
          </div>
        </div>
        <div className='notes_container'>
          <div className='input_container'>
            <label className='each_note'>
              GPA:
              <input className='each_note_input' type="number" step="0.1" value={gpa} onChange={(e) => setGpa(e.target.value)} />
              <div className='line'></div>
            </label>
            <label className='each_note'>
              IELTS:
              <input className='each_note_input' type="number" step="0.5" value={ielts} onChange={(e) => setIelts(e.target.value)} />
              <div className='line'></div>
            </label>
            <label className='each_note'>
              SAT:    
              <input className='each_note_input' type="number" step="0.1" value={sat} onChange={(e) => setSat(e.target.value)} />
            </label>
            <p>{errorMessage}</p>
            <button className='save_notes_btn' onClick={handleUpdateProfile}><span className='btn_lbl'>SAVE SCORES</span></button>
          </div>
          <div className='notes_average_container'>
            <p className='notes_average_title'>Average</p>
            <div className='notes_average_subcontainer'>
              <div className='notes_average'>
                <p>GPA</p>
                <p style={{color: 'black'}}>{averages.gpa}</p>
              </div>
              <div className='notes_average'>
                <p>IELTS</p>
                <p style={{color: 'black'}}>{averages.ielts}</p>
                </div>
                <div className='notes_average'>
                <p >SAT</p>
                <p style={{color: 'black'}}>{averages.sat}</p>
                </div>
              </div>
              <p className='notes_average_title'>Your Scores</p>
            <div className='notes_average_subcontainer'>
              <div className='notes_average'>
                <p>GPA</p>
                <p style={{color: 'black'}}>{user.gpa}</p>
              </div>
              <div className='notes_average'>
                <p>IELTS</p>
                <p style={{color: 'black'}}>{user.ielts}</p>
                </div>
                <div className='notes_average'>
                <p>SAT</p>
                <p style={{color: 'black'}}>{user.sat}</p>
                </div>
              </div>
          </div>
        </div>  
      </div>
      
      <h2>Избранные университеты</h2>
      <ul className='favourite_unis'>
        {favorites.map((university, index) => (
          <li className='favourite_uni'key={index}>
            <div className='favourite_uni_name'>
              {university.name} 
            </div>
            <div className='favourite_uni_content'>
            {university.country}
            {university.web_pages && university.web_pages.length > 0 && (
              <div>
                {university.web_pages.map((webPage, i) => (
                  <a key={i} href={webPage} target="_blank" rel="noopener noreferrer">
                    {webPage}
                  </a>
                ))} 
                
              </div>
            )}
            </div>
            <button className="remove_btn" onClick={() => removeFavorite(university._id)}><img style={{width: "25px" , height: "25px"}} src='https://cdn-icons-png.flaticon.com/512/6861/6861362.png'/></button>
          </li>
        ))}
      </ul>
      
    </div>
  );
};

export default Profile;
