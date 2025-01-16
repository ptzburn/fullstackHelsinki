import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { createComment } from '../reducers/blogsReducer'
import { useParams } from 'react-router-dom'
import { Button, TextField } from '@mui/material'

const CommentForm = () => {
  const [content, setContent] = useState('')

  const dispatch = useDispatch()
  const id = useParams().id

  const addComment = event => {
    event.preventDefault()

    const newComment = {
      content: content,
      blogId: id
    }

    dispatch(createComment(newComment))

    setContent('')
  }

  return(
    <form onSubmit={addComment}>
      <div>
        <TextField
          label="Type here"
          type="text"
          value={content}
          aria-label='Comment'
          name="Comment"
          onChange={({ target }) => setContent(target.value)}
          fullWidth
          multiline
          rows={4}
          variant='outlined'
        />
        <Button variant='outlined' colour='primary' type="submit">Add Comment</Button>
      </div>
    </form>
  )
}

export default CommentForm