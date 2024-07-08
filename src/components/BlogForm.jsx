import React from 'react';

const BlogForm = ({ addBlog, newTitle, newAuthor, newUrl, handleBlogChange }) => {
  return (
    <form onSubmit={addBlog}>
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
