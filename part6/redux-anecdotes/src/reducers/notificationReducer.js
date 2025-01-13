import { createSlice } from "@reduxjs/toolkit"

const notificationSlice = createSlice({
    name: 'notification',
    initialState: '',
    reducers: {
        showNotification(state, action) {
            const notification = action.payload
            return notification
        },
        clearNotification(state, action) {
            return ''
        }
    }
})

export const { showNotification, clearNotification } = notificationSlice.actions

export const setNotification = (message, seconds) => {
    return dispatch => {
        dispatch(showNotification(message))
        setTimeout(() => {
            dispatch(clearNotification())
        }, seconds * 1000)
    }
}
export default notificationSlice.reducer