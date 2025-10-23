import React, { useState, useEffect } from 'react';
import './UniversityList.css';

const UniversityList = ({ addFavorite }) => {
  const [universities, setUniversities] = useState([]);
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [sortOption, setSortOption] = useState(''); 
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const universitiesPerPage = 25;

  const fetchUniversities = async () => {
    setLoading(true);
    try {
      const query = `name=${name}`;
      const response = await fetch(`http://universities.hipolabs.com/search?${query}`);
      const data = await response.json();

      const filteredData = data.filter((university) =>
        university.country.toLowerCase().includes(country.toLowerCase())
      );

      setUniversities(filteredData);
    } catch (error) {
      console.error("Ошибка загрузки университетов:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUniversities();
  }, [name, country]);

  const handleSearch = (event) => {
    event.preventDefault();
    setPage(1);
    fetchUniversities();
  };

  // Функция для сортировки университетов
  const sortedUniversities = () => {
    let sortedList = [...universities];
    if (sortOption === 'nameAsc') {
      sortedList.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === 'nameDesc') {
      sortedList.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortOption === 'countryAsc') {
      sortedList.sort((a, b) => a.country.localeCompare(b.country));
    } else if (sortOption === 'countryDesc') {
      sortedList.sort((a, b) => b.country.localeCompare(a.country));
    }
    return sortedList;
  };

  const handleNextPage = () => setPage(page + 1);
  const handlePrevPage = () => setPage(page > 1 ? page - 1 : 1);

  const paginatedUniversities = sortedUniversities().slice(
    (page - 1) * universitiesPerPage,
    page * universitiesPerPage
  );

  return (
    <div className='unisContainer'>
      <h2>List of universities</h2>
      <form className="searchContainer" onSubmit={handleSearch}>
        <input
          className='searchBar'
          type="text"
          placeholder="Name of university..."
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button className="searchButton" type="submit">Search</button>
      </form>
      <form className="searchContainer" onSubmit={handleSearch}>
        <input
          className='searchBar'
          type="text"
          placeholder="Country..."
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        />
        <button className="searchButton" type="submit">Search</button>
      </form>

      <div className="sortContainer">
        <label>sort by: </label>
        <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
          <option value="">none</option>
          <option value="nameAsc">name of university (A-Z)</option>
          <option value="nameDesc">name of university (Z-А)</option>
          <option value="countryAsc">name of country  (А-Z)</option>
          <option value="countryDesc">name of country (Z-А)</option>
        </select>
      </div>

      {loading ? (
        <img style={{width:"100px", height:"100px"}} src='https://cdn.pixabay.com/animation/2022/07/29/03/42/03-42-11-849_512.gif'/>
      ) : (
        <ul className='unis'>
          {paginatedUniversities.map((university) => (
            <li className='uni' key={university.name}>
              <div className='uniContent'>
                 <h3 className='uniTitle'>{university.name}</h3>
                <div className='uniContentContainer'>
                  <p className='uniDesc'>Страна: {university.country}</p>
                  <p className='uniDesc'>
                    {university.web_pages.map((webPage, index) => (
                      <a className='uniLink' key={index} href={webPage} target="_blank" rel="noopener noreferrer">
                        {webPage}
                      </a>
                    ))}
                  </p>
                  <button className='fav_btn' onClick={() => addFavorite(university)}><span className='btn_lbl'>favorite</span></button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="pagination">
        <button onClick={handlePrevPage} disabled={page === 1}>previous</button>
        <span>Page {page}</span>
        <button onClick={handleNextPage} disabled={universities.length <= page * universitiesPerPage}>next</button>
      </div>
    </div>
  );
};

export default UniversityList;

