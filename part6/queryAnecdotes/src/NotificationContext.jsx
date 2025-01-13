import { createContext, useReducer, useContext } from 'react'

const notificationReducer = (state, action) => {
    switch (action.type) {
        case 'SET_NOTIFICATION':
            return action.payload
        case 'CLEAR_NOTIFICATION':
            return ''
        default:
            return ''
    }
}

const NotificationContext = createContext()

export const NotificationContextProvider = props => {
    const [notification, notificationDispatch] = useReducer(notificationReducer, '')

    const setNotification = message => {
        notificationDispatch({ type: 'SET_NOTIFICATION', payload: message })
        setTimeout(() => notificationDispatch({ type: 'CLEAR_NOTIFICATION' }), 5000)
    }

    return (
        <NotificationContext.Provider value={{ notification, notificationDispatch, setNotification }}>
            {props.children}
        </NotificationContext.Provider>
    )
}

export const useNotification = () => {
    const context = useContext(NotificationContext)
    return context
}

export default NotificationContext