import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import './PostDetails.css';

const PostDetails = ({ currentUser }) => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [author, setAuthor] = useState("");
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:4444/posts/${id}`);
        setPost(response.data);
        const userResponse = await axios.get(`http://localhost:4444/users/${response.data.user}`);
        setAuthor(userResponse.data);
      } catch (error) {
        console.error('Ошибка при загрузке поста:', error);
      }
    };
    fetchPost();
  }, [id]);

  const fetchComments = async () => {
    try {
      const response = await axios.get(`http://localhost:4444/posts/${id}/comments`);
      setComments(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке комментариев:', error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [id]);

  const handleAddComment = async () => {
    if (commentText.trim()) {
      try {
        await axios.post(
          `http://localhost:4444/posts/${id}/comments`,
          { text: commentText },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        setCommentText('');
        fetchComments();
      } catch (error) {
        console.error('Ошибка при добавлении комментария:', error);
      }
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`http://localhost:4444/posts/${id}/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setComments((prevComments) => prevComments.filter((c) => c._id !== commentId));
    } catch (error) {
      console.error('Ошибка при удалении комментария:', error);
    }
  };

  if (!post) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="postDetails">
      <h1>{post.title}</h1>
      <p className="postDetails-author">Автор: {author.fullName}</p>
      <p>Просмотры: {post.viewsCount}</p>

      <div className="postDetails-tags">
        {post.tags?.map((tag, index) => (
          <span key={index} className="postDetails-tag">
            {tag}
          </span>
        ))}
      </div>

      <p className="postDetails-content">{post.text}</p>
      {post.imageUrl && (
        <img src={`http://localhost:4444${post.imageUrl}`} alt="Post" className="postDetails-image" />
      )}

      <div className="postDetails-commentSection">
        <h3>Оставить комментарий:</h3>
        <textarea
          className="postDetails-commentTextarea"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          rows="4"
        ></textarea>
        <button className="postDetails-commentButton" onClick={handleAddComment}>
          Отправить
        </button>
      </div>

      <div className="postDetails-commentsList">
        <h3>Комментарии:</h3>
        {comments.length > 0 ? (
          [...comments].reverse().map((comment) => (
            <div key={comment._id} className="postDetails-comment">
              <p className="postDetails-commentAuthor">{comment.user?.fullName}</p>
              <p className="postDetails-commentText">{comment.text}</p>
              <p className="postDetails-commentDate">
                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
              </p>
              {currentUser?._id === comment.user._id && (
                <button
                  className="postDetails-deleteButton"
                  onClick={() => handleDeleteComment(comment._id)}
                >
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/6861/6861362.png"
                    alt="Delete"
                  />
                </button>
              )}
            </div>
          ))
        ) : (
          <p>Комментариев пока нет</p>
        )}
      </div>
    </div>
  );
};

export default PostDetails;
