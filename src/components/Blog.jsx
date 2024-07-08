import React, { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, handleLike, handleDelete, currentUser }) => {
  const [detailsVisible, setDetailsVisible] = useState(false)

  const toggleDetails = () => {
    setDetailsVisible(!detailsVisible)
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
          likes {blog.likes} <button onClick={() => handleLike(blog)}>like</button><br />
            {blog.author}</p>
          {/* Only show the button if the user is the same as the blog user */}
          {currentUser && blog.user && blog.user.username === currentUser.username && (
            <button onClick={() => handleDelete(blog)}>remove</button>
          )}
        </div>
      )}
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  handleLike: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  currentUser: PropTypes.object
}

export default Blog
