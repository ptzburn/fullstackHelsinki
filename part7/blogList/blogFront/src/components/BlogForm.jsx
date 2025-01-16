import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { createBlog } from '../reducers/blogsReducer'
import { Box, Button, TextField } from '@mui/material'

const BlogForm = ({ toggle }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const dispatch = useDispatch()

  const addBlog = event => {
    event.preventDefault()

    const newBlog = {
      title: title,
      author: author,
      url: url
    }

    dispatch(createBlog(newBlog))
    toggle()
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <form onSubmit={addBlog}>
      <h2>Add a blog</h2>
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          alignItems: 'center',
          flexWrap: 'wrap'
        }}
      >
        <TextField label="Title" type="text" value={title} aria-label='Title' name="Title" onChange={({ target }) => setTitle(target.value)} />
        <TextField label="Author" type="text" value={author} aria-label='Author' name="Author" onChange={({ target }) => setAuthor(target.value)} />
        <TextField label="URL" type="text" value={url} aria-label='URL' name="URL" onChange={({ target }) => setUrl(target.value)} />
        <Button variant="contained" color="primary" type="submit">Add</Button>
        <Button type="button" variant="outlined" color="primary" onClick={() => toggle()}>Cancel</Button>
      </Box>
    </form>
  )
}

export default BlogForm