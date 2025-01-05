import { useState, useEffect, useRef } from 'react'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Blog from './components/Blog'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(false)

  const blogFormRef = useRef()

  useEffect(() => {
    const fetchBlogs = async () => {
      const fetchedBlogs = await blogService.getAll()
      const sortedBlogs = fetchedBlogs.sort((a, b) => b.likes - a.likes)
      setBlogs(sortedBlogs)
    }
    fetchBlogs()
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async newUser => {
    try {
      const user = await loginService.login(newUser)
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
    } catch (exception) {
      setMessage('Wrong username or password')
      setError(true)
      setTimeout(() => {
        setMessage(null)
        setError(false)
      }, 5000)
    }
  }

  const handleAdding = async newBlog => {
    try {
      blogFormRef.current.toggleVisibility()
      const returnedBlog = await blogService.addNew(newBlog)
      setBlogs(blogs.concat(returnedBlog))
      setMessage(`New blog added: ${newBlog.title} by ${newBlog.author}`)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    } catch (exception) {
      setMessage('Not Authorized. Try logging in anew.')
      setError(true)
      setTimeout(() => {
        setMessage(null)
        setError(false)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const handleLike = async targetBlog => {
    try {
      const updatedBlog = { ...targetBlog, likes: targetBlog.likes + 1 }
      await blogService.update(updatedBlog)
      const updatedBlogs = blogs.map(blog => blog.id === updatedBlog.id ? updatedBlog : blog)
      setBlogs(updatedBlogs)
    } catch (exception) {
      setMessage('Something went wrong.')
      setError(true)
      setTimeout(() => {
        setMessage(null)
        setError(false)
      }, 5000)
    }
  }

  const handleRemove = async targetBlog => {
    if (window.confirm(`You are about to delete ${targetBlog.title} by ${targetBlog.author}. Proceed?`)) {
      try {
        await blogService.remove(targetBlog)
        const updatedBlogs = blogs.filter(blog => blog.id !== targetBlog.id)
        setBlogs(updatedBlogs)
      } catch (exception) {
        setMessage('Not authorized or the blog has already been removed.')
        setError(true)
        setTimeout(() => {
          setMessage(null)
          setError(false)
        }, 5000)
      }
    }
  }

  return (
    <div>
      <Notification message={message} isError={error} />
      {user === null ?
        <LoginForm handleLogin={handleLogin} /> :
        <div>
          You're logged in as: {user.name}
          <button onClick={handleLogout}>logout</button>
          <Togglable buttonLabel='Add a blog' ref={blogFormRef}>
            <BlogForm createBlog={handleAdding} />
          </Togglable>
          <div data-testid="blogs">
            <h1>Blogs</h1>
            {blogs.map(blog => (
              <Blog
                key={blog.id}
                blog={blog}
                user={user}
                handleLike={handleLike}
                handleRemove={handleRemove}
              />
            ))}
          </div>
        </div>
      }
    </div>
  )
}

export default App