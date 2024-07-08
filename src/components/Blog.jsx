import React, { useState } from 'react';

const Blog = ({ blog }) => {
  const [detailsVisible, setDetailsVisible] = useState(false);

  const toggleDetails = () => {
    setDetailsVisible(!detailsVisible);
  }

  return (
    <div className="blog">
      <div>
        {blog.title} {blog.author}
        <button onClick={toggleDetails}>{detailsVisible ? 'hide' : 'view'}</button>
      </div>
      {detailsVisible && (
        <div className="blog-details">
          <p>{blog.url}<br />
          likes {blog.likes} <button>like</button><br />
          {blog.author}</p>
        </div>
      )}
    </div>
  );
}

export default Blog;
