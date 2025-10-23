import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './News.css';


const News = () => {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/news');
        setArticles(response.data.slice(0, 5)); 
      } catch (err) {
        setError('Ошибка при получении новостей' + err);
      }
    };

    fetchNews();
  }, []);

  return (
    <div>
      <div className="news">
        {error ? (
          <p>Error: {error}</p>
        ) : (
          <ul className='news'>
            {articles.map((novost, index) => (
              <li className='new' key={index}>
                <div className='author'>{novost.source.name}</div>
                <div className="content">{novost.title}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default News;
