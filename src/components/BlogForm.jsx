import React, { useState } from 'react';

const BlogForm = ({ addBlog }) => {
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newUrl, setNewUrl] = useState('');

  const handleBlogChange = (event) => {
    const { name, value } = event.target;
    if (name === 'title') {
      setNewTitle(value);
    } else if (name === 'author') {
      setNewAuthor(value);
    } else if (name === 'url') {
      setNewUrl(value);
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    addBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    });
    setNewTitle('');
    setNewAuthor('');
    setNewUrl('');
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>create new</h2>
      <label>title:</label>
      <input name="title" value={newTitle} onChange={handleBlogChange} />
      <br />
      <label>author:</label>
      <input name="author" value={newAuthor} onChange={handleBlogChange} />
      <br />
      <label>url:</label>
      <input name="url" value={newUrl} onChange={handleBlogChange} />
      <br />
      <button type="submit">save</button>
    </form>
  );
}

export default BlogForm;
