import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = event => {
    event.preventDefault()

    const newBlog = {
      title: title,
      author: author,
      url: url
    }
    createBlog(newBlog)

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return(
    <form onSubmit={addBlog}>
      <h2>Add a blog</h2>
      <div>
                title
        <input type="text" value={title} aria-label='Title' name="Title" onChange={({ target }) => setTitle(target.value)} />
      </div>
      <div>
                author
        <input type="text" value={author} aria-label='Author' name="Author" onChange={({ target }) => setAuthor(target.value)} />
      </div>
      <div>
                url
        <input type="text" value={url} aria-label='URL' name="URL" onChange={({ target }) => setUrl(target.value)} />
      </div>
      <button type="submit">Add</button>
    </form>
  )
}

export default BlogForm