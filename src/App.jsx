import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import './index.css';

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState({ message: null, type: '' });

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const addBlog = (event) => {
    event.preventDefault()
    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    }
  
    try {
      if (!newTitle || !newAuthor || !newUrl) {
        setNotification({
          message: 'Title, Author and URL are required',
          type: 'error'
        })
        setTimeout(() => {
          setNotification({ message: null, type: '' })
        }, 5000)
        return
      }
    }
    catch (exception) {
      setNotification({
        message: 'Title, Author and URL are required',
        type: 'error'
      })
      setTimeout(() => {
        setNotification({ message: null, type: '' })
      }, 5000)
    }
    try{
      blogService
      .create(blogObject)
        .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setNewTitle('') // Reset title state
        setNewAuthor('') // Reset author state
        setNewUrl('') // Reset URL state
        setNotification({
          message: `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`,
          type: 'success'
        })
        setTimeout(() => {
          setNotification({ message: null, type: '' })
        }, 5000)
      })
    } catch (exception) {
      setNotification({
        message: 'Error creating blog',
        type: 'error'
      })
      setTimeout(() => {
        setNotification({ message: null, type: '' })
      }, 5000)
    }
  }

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

  const handleLogin = async (event) => {
    event.preventDefault()
    
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setNotification({
        message: 'Wrong credentials',
        type: 'error'
      })
      setTimeout(() => {
        setNotification({ message: null, type: '' })
      }, 5000)
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
          <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
          <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>      
  )

  const logout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const blogForm = () => (
    <form onSubmit={addBlog}>
      <h2>create new</h2>
      <label>title:</label><input name="title" value={newTitle} onChange={handleBlogChange} />
      <br />
      <label>author:</label><input name="author" value={newAuthor} onChange={handleBlogChange} />
      <br />
      <label>url:</label><input name="url" value={newUrl} onChange={handleBlogChange} />
      <br />
      <button type="submit">save</button>
    </form>  
  )

  return (
    <div>
      <h1>Blog App</h1>

      <Notification message={notification.message} type={notification.type} />

      {user === null ?
        loginForm() :
        <div>
          <p>{user.name} logged-in <button onClick={() => logout()}>logout</button></p>
          {blogForm()}
          <h2>blogs</h2>
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} />
          )}
        </div>
      }

    </div>
  )
}

export default App