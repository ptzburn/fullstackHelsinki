import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'
import loginService from '../services/login'
import { showNotification } from './notificationReducer'

const userSlice = createSlice({
    name: 'user',
    initialState: null,
    reducers: {
        setUser(state, action) {
            return action.payload
        },
        clearUser(state, action) {
            return null
        }
    }
})

export const { setUser, clearUser } = userSlice.actions

export const fetchUser = () => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    return dispatch => {
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            blogService.setToken(user.token)
            dispatch(setUser(user))
        }
    }
}

export const loginUser = newUser => {
    return async dispatch => {
        try {
            const user = await loginService.login(newUser)
            window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
            blogService.setToken(user.token)
            dispatch(setUser(user))
        } catch (exception) {
            dispatch(showNotification('Wrong username or password.', true, 5))
            throw new Error('Invalid credentials')
        }
    }
}

export const logout = () => {
    return dispatch => {
        window.localStorage.removeItem('loggedBlogappUser')
        dispatch(clearUser())
    }
}

export default userSlice.reducer