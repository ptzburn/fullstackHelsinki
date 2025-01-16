import { Container } from '@mui/material'
import { useEffect, useRef } from 'react'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Blog from './components/Blog'
import Togglable from './components/Togglable'
import { useDispatch, useSelector } from 'react-redux'
import { initializeBlogs } from './reducers/blogsReducer'
import { fetchUser } from './reducers/userReducer'
import {
  BrowserRouter as Router,
  Routes, Route, Link
} from 'react-router-dom'
import Users from './components/Users'
import User from './components/User'
import BlogInfo from './components/BlogInfo'
import Menu from './components/Menu'

const App = () => {
  const dispatch = useDispatch()

  const blogs = useSelector((state) => state.blogs)
  const user = useSelector((state) => state.user)

  const blogFormRef = useRef()

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [])

  useEffect(() => {
    dispatch(fetchUser())
  }, [])

  const handleToggle = () => {
    blogFormRef.current.toggleVisibility()
  }

  return (
    <Container>
      <Notification />
      <Router>
        <Menu />
        <Routes>
          <Route path="/" element={
            <div data-testid="blogs">
              <h1>Blogs</h1>
              {user &&
                <Togglable buttonLabel='Add a blog' ref={blogFormRef}>
                  <BlogForm toggle={handleToggle} />
                </Togglable>
              }
              {blogs.map(blog => (
                <Blog
                  key={blog.id}
                  blog={blog}
                />
              ))}
            </div>
          } />
          <Route path="/users" element={<Users />} />
          <Route path="/users/:id" element={<User />} />
          <Route path="/blogs/:id" element={<BlogInfo />} />
          <Route path="/login" element={<LoginForm />} />
        </Routes>
      </Router>
    </Container>
  )
}

export default App