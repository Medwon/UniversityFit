import React, { useState } from 'react';
import axios from 'axios';
import './Gpacalc.css';


function App() {
  const [subjects, setSubjects] = useState([{ subject: '', grade: '' }]);
  const [gpa, setGpa] = useState(null);
  const [notification, setNotification] = useState(null);
  // Добавить новый предмет
  const addSubject = () => {
    setSubjects([...subjects, { subject: '', grade: '' }]);
  };

  // Обновить предмет или оценку
  const handleChange = (index, field, value) => {
    const updatedSubjects = [...subjects];
    updatedSubjects[index][field] = field === 'grade' ? Number(value) : value;
    setSubjects(updatedSubjects);
  };

  // Удалить предмет
  const removeSubject = (index) => {
    const updatedSubjects = subjects.filter((_, i) => i !== index);
    setSubjects(updatedSubjects);
  };

  const calculateGpa = async () => {
    const invalidGrades = subjects.some(
      (item) => item.grade === '' || item.grade < 0 || item.grade > 5
    );

    if (invalidGrades) {
      setNotification('Grades must be between 0 and 5.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:4444/calculate-gpa', { grades: subjects });
      setGpa(response.data.gpa);
      setNotification(null); // Clear notification on success
    } catch (error) {
      console.error('Error calculating GPA:', error);
      setNotification('An error occurred while calculating GPA.');
    }
  };

  return (
    <div className = "container_calc"style={{ padding: '20px' }}>
      <h1>GPA Calculator</h1>
      {subjects.map((item, index) => (
        <div className='subject-row' key={index} style={{ display: 'flex', marginBottom: '10px' }}>
          <input
            className='input_calc'
            type="text"
            placeholder="Subject"
            value={item.subject}
            onChange={(e) => handleChange(index, 'subject', e.target.value)}
            style={{ marginRight: '10px' }}
            required
          />
          <input
            required
            className='input_calc'
            max={5}
            type="number"
            placeholder="Grade"
            value={item.grade}
            onChange={(e) => handleChange(index, 'grade', e.target.value)}
            style={{ marginRight: '10px' }}
          />
          <button  style={{backgroundColor: "white", border:'none', cursor:"pointer"}}  onClick={() => removeSubject(index)}><img style={{width: "25px" , height: "25px"}} src='https://cdn-icons-png.flaticon.com/512/6861/6861362.png'/></button>
        </div>
      ))}
      <button className='button_calc' onClick={addSubject}>Add Subject</button>
      <button className='button_calc' onClick={calculateGpa} style={{ marginLeft: '10px' }}>Calculate GPA</button>
      {notification && <div className="notification-box">{notification}</div>}
      {gpa && <h2 className='gpa-result'>Your GPA: {gpa}</h2>}
    </div>
  );
}

export default App;
