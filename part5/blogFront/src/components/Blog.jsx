import { useState, useEffect } from 'react'
import userService from '../services/users'

const Blog = ({ blog, user, handleLike, handleRemove }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [visible, setVisible] = useState(false)
  const [blogUserName, setBlogUserName] = useState('')
  const [blogUserUsername, setBlogUserUsername] = useState('')

  useEffect(() => {
    const fetchBlogUser = async () => {
      if (blog.user.name) {
        setBlogUserName(blog.user.name)
        setBlogUserUsername(blog.user.username)
      } else {
        const users = await userService.getAll()
        const blogUser = users.find(user => user.id === blog.user)
        setBlogUserName(blogUser.name)
        setBlogUserUsername(blogUser.username)
      }
    }

    fetchBlogUser()
  }, [blog.user])

  const isAddedByUser = () => {
    return user.username === blogUserUsername
  }

  const deleteButton = () => (
    <button onClick={() => handleRemove(blog)}>Delete</button>
  )

  return (
    <div data-testid={blog.title} style={blogStyle}>
      {blog.title} by {blog.author}
      {!visible && <button onClick={() => setVisible(true)}>View</button>}
      {visible && (
        <div>
          <p data-testid="url">URL: {blog.url}</p>
          <div data-testid="likes">Likes: {blog.likes}
            <button onClick={() => handleLike(blog)}>LIKE</button>
          </div>
          <p>Added by: {blogUserName}</p>
          <button onClick={() => setVisible(false)}>Hide</button>
          {isAddedByUser() && deleteButton()}
        </div>
      )}
    </div>
  )
}

export default Blog