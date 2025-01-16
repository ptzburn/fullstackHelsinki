import { createSlice } from "@reduxjs/toolkit"
import blogService from "../services/blogs"
import commentService from "../services/comments"
import { showNotification } from "./notificationReducer"

const blogsSlice = createSlice({
  name: "blogs",
  initialState: [],
  reducers: {
    appendBlog(state, action) {
      state.push(action.payload)
    },
    setBlogs(state, action) {
      return action.payload
    },
    setLikes(state, action) {
      const updatedBlog = action.payload
      return state.map((blog) =>
        blog.id !== updatedBlog.id ? blog : updatedBlog
      )
    },
    setComments(state, action) {
      const comment = action.payload
      const blogToUpdate = state.find((blog) => blog.id === comment.blog)
      const updatedBlog = {
        ...blogToUpdate,
        comments: blogToUpdate.comments.concat(comment),
      }
      return state.map((blog) =>
        blog.id !== comment.blog ? blog : updatedBlog
      )
    },
    removalOf(state, action) {
      const targetBlog = action.payload
      return state.filter((blog) => blog.id !== targetBlog.id)
    },
  },
})

export const { appendBlog, setBlogs, setLikes, setComments, removalOf } =
  blogsSlice.actions

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes)
    dispatch(setBlogs(sortedBlogs))
  }
}

export const createBlog = (newBlog) => {
  return async (dispatch) => {
    try {
      const returnedBlog = await blogService.addNew(newBlog)
      dispatch(appendBlog(returnedBlog))
      dispatch(
        showNotification(
          `New blog added: ${returnedBlog.title} by ${returnedBlog.author}`,
          false,
          5
        )
      )
    } catch (exception) {
      dispatch(showNotification("Check your input or log in anew.", true, 5))
    }
  }
}

export const createComment = (newComment) => {
  return async (dispatch) => {
    try {
      const returnedComment = await commentService.addNew(newComment)
      dispatch(setComments(returnedComment))
      dispatch(showNotification("New comment added.", false, 5))
    } catch (exception) {
      dispatch(showNotification("Something went wrong...", true, 5))
    }
  }
}

export const like = (targetBlog) => {
  const updatedBlog = { ...targetBlog, likes: targetBlog.likes + 1 }
  return async (dispatch) => {
    try {
      await blogService.update(updatedBlog)
      dispatch(setLikes(updatedBlog))
      dispatch(
        showNotification(
          `You liked '${updatedBlog.title}' by ${updatedBlog.author}`,
          false,
          5
        )
      )
    } catch (exception) {
      dispatch(showNotification("Something went wrong...", true, 5))
    }
  }
}

export const remove = (targetBlog) => {
  return async (dispatch) => {
    const confirmed = window.confirm(
      `You are about to delete '${targetBlog.title}' by ${targetBlog.author}. Proceed?`
    )
    if (!confirmed) return

    try {
      await blogService.remove(targetBlog)
      dispatch(removalOf(targetBlog))
      dispatch(
        showNotification(
          `You deleted '${targetBlog.title}' by ${targetBlog.author}`,
          false,
          5
        )
      )
    } catch (exception) {
      dispatch(
        showNotification(
          "Not authorized or the blog has already been removed.",
          true,
          5
        )
      )
      throw new Error("Not authorized or the blog has already been removed.")
    }
  }
}

export default blogsSlice.reducer
