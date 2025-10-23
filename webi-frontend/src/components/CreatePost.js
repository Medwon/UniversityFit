import React, { useState } from 'react';
import axios from 'axios';
import "./CreatePost.css"

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [tags, setTags] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const tagsArray = tags.split(',').map((tag) => tag.trim());
      const response = await axios.post(
        'http://localhost:4444/posts',
        {
          title,
          text,
          tags: tagsArray,
          imageUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Если требуется аутентификация
          },
        }
      );
      console.log('Пост создан:', response.data);
      setTitle('');
      setText('');
      setTags('');
      setImageUrl('');
    } catch (error) {
      console.error('Ошибка при создании поста:', error);
    }
  };

  return (
    <div className="containerCreatePost">
      <h2 className="headerCreatePost">Создать новый пост</h2>
      <form onSubmit={handleSubmit} className="formCreatePost">
        <div className="formGroupCreatePost">
          <label className="labelCreatePost">Заголовок</label>
          <input
            className="inputCreatePost"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="formGroupCreatePost">
          <label className="labelCreatePost">Текст</label>
          <textarea
            className="textareaCreatePost"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          />
        </div>
        <div className="formGroupCreatePost">
          <label className="labelCreatePost">Теги (через запятую)</label>
          <input
            className="inputCreatePost"
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>
        <button type="submit" className="buttonCreatePost">Добавить пост</button>
      </form>
    </div>
  );
};

export default CreatePost;
