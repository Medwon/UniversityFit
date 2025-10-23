import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import plus_icon from "../Assets/plus.png";
import './Post.css';

import axios from 'axios';

const Posts = ({ currentUser }) => {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [sortOption, setSortOption] = useState('latest'); // Сортировка по умолчанию

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:4444/posts');
        setPosts(response.data);
        setFilteredPosts(response.data); // Изначально все посты отображаются
      } catch (error) {
        console.error("Couldn't fetch posts:", error);
      }
    };
    fetchPosts();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchQuery.toLowerCase();

    // Фильтруем посты по названию или тегам
    const filtered = posts.filter(
      (post) =>
        post.title.toLowerCase().includes(query) ||
        (post.tags && post.tags.some((tag) => tag.toLowerCase().includes(query)))
    );
    setFilteredPosts(filtered);
  };

  const handleDelete = async (postId) => {
    try {
      await axios.delete(`http://localhost:4444/posts/${postId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
      setFilteredPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
    } catch (error) {
      console.error("Couldn't delete post:", error);
    }
  };

  const sortPosts = (option, postsToSort) => {
    let sortedPosts = [...postsToSort];
    if (option === 'latest') {
      // Сортировка по дате добавления
      sortedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (option === 'most_viewed') {
      // Сортировка по количеству просмотров
      sortedPosts.sort((a, b) => b.viewsCount - a.viewsCount);
    }
    return sortedPosts;
  };

  return (
    <div>
      <div className='create_post' style={{ display: 'flex', alignItems: "center", fontSize: "24px", fontWeight: '600' }}>
        <Link to={'/create-post'}>
          <img style={{ width: '50px', height: '50px', cursor: 'pointer' }} src={plus_icon} />
        </Link> Create post
      </div>
      <form className="searchContainer" onSubmit={handleSearch}>
        <input
          className="searchBar"
          type="text"
          placeholder="Search by tags or title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="searchButton" type="submit">Search</button>
      </form>

      {/* Добавляем выпадающий список для сортировки */}
      <div className="sortContainer" style={{ margin: '10px 0' }}>
        <label htmlFor="sort" style={{ fontWeight: 'bold', marginRight: '10px' }}>Sort by:</label>
        <select
          id="sort"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="latest">Newest</option>
          <option value="most_viewed">Most Viewed</option>
        </select>
      </div>

      {/* Применяем сортировку перед отображением постов */}
      {sortPosts(sortOption, filteredPosts).map((post) => (
        <div key={post._id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0', height: "200px" }}>
          <Link to={`/posts/${post._id}`}>
            <h2 className='post_title'>{post.title}</h2>
          </Link>
          <p>Author: {post.user ? post.user.fullName : 'Unknown'}</p>
          <p className='post_text'>{post.text}</p>
          <p>Created: {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</p>
          <div style={{ display: post.tags && post.tags.length > 1 ? 'block' : 'none', marginTop: '10px' }}>
            {post.tags?.map((tag, index) => (
              <span key={index} style={{ marginRight: '5px', backgroundColor: '#eee', padding: '2px 5px' }}>
                {tag}
              </span>
            ))}
          </div>
          <p style={{ display: 'flex', alignItems: "center" }}>
            <img src='https://icons.veryicon.com/png/o/construction-tools/tool-1/eye-61.png' style={{ width: '25px', height: '25px' }}></img>{post.viewsCount}
          </p>

          {currentUser && post.user && currentUser._id === post.user._id && (
            <button style={{ backgroundColor: "white", border: 'none', cursor: "pointer" }} onClick={() => handleDelete(post._id)}>
              <img style={{ width: "25px", height: "25px" }} src='https://cdn-icons-png.flaticon.com/512/6861/6861362.png' />
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default Posts;
