import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../components/LeaderBoard.css'
const Leaderboard = () => {
    const [users, setUsers] = useState([]);
    const [sortBy, setSortBy] = useState("gpa");
    const [filters, setFilters] = useState({
        gpaMin: "",
        gpaMax: "",
        ieltsMin: "",
        ieltsMax: "",
        satMin: "",
        satMax: "",
    });
    
    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };
    
    const fetchUsers = async () => {
        try {
            const { gpaMin, gpaMax, ieltsMin, ieltsMax, satMin, satMax } = filters;
            const response = await axios.get('http://localhost:4444/leaderboard', {
                params: { 
                    sortBy,
                    gpaMin,
                    gpaMax,
                    ieltsMin,
                    ieltsMax,
                    satMin,
                    satMax
                }
            });
            setUsers(response.data);
            console.log(response.data);
        } catch (error) {
            console.error("Ошибка при загрузке списка пользователей:", error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [sortBy]);

    return (
        <div className='leaderboard_page'>
            <div className='filter_container'> 
                <div>
                    <label style={{fontSize : "24px", marginRight: '15px'}}>Sort by</label>
                    <select onChange={(e) => setSortBy(e.target.value)} value={sortBy}>
                        <option value="gpa">GPA</option>
                        <option value="ielts">IELTS</option>
                        <option value="sat">SAT</option>
                    </select>
                </div>
                <div className='diapazon_container'>
                    <div className='fiter_input_container'>
                        <label >GPA:</label>
                        <input placeholder='from' className='fiter_input' type="number" step="0.1" name="gpaMin" value={filters.gpaMin} onChange={handleFilterChange} />
                        <input placeholder='to' className='fiter_input' type="number" step="0.1" name="gpaMax" value={filters.gpaMax} onChange={handleFilterChange} />
                    </div>
                    <div className='fiter_input_container'>
                        <label>IELTS:</label>
                        <input placeholder='from' className='fiter_input'  type="number" step="0.1" name="ieltsMin" value={filters.ieltsMin} onChange={handleFilterChange} />
                        <input placeholder='to' className='fiter_input' type="number" step="0.1" name="ieltsMax" value={filters.ieltsMax} onChange={handleFilterChange} />
                    </div>
                    <div className='fiter_input_container'>
                        <label>SAT:</label>
                        <input placeholder='from' className='fiter_input' type="number" name="satMin" value={filters.satMin} onChange={handleFilterChange} />
                        <input placeholder='to' className='fiter_input' type="number" name="satMax" value={filters.satMax} onChange={handleFilterChange} />
                    </div>
                </div>
                <button style={{marginTop: '20px'}} className='log_btn' onClick={fetchUsers}><span className='btn_lbl'>apply</span></button>
            </div>

            <ul className='users_container'>
                {users.map((user , index) => (
                    <li className='each_user' key={user._id} onClick={() =>  window.open(
                        `https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(user.email)}&su=Hello ${encodeURIComponent(user.fullName)}`, 
                        '_blank'
                    )}>
                        <div className='user_postition'>{index + 1}</div>
                        {user.avatarUrl ? (
                                    <img className='each_user_ava' src={`http://localhost:4444${user.avatarUrl}`} alt="Avatar" />
                                ) : (
                                    <div style={{ width: '50px', height: '50px', backgroundColor: '#ccc', borderRadius: '50%' }}></div>
                                )}
                        <div className='each_user_content'>
                            <div className='each_user_name'>
                                {user.fullName}  
                            </div>
                            <div className='each_user_notes'>
                                GPA: {user.gpa} IELTS: {user.ielts} SAT: {user.sat}
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Leaderboard;
