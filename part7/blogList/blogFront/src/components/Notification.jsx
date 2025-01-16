import { Alert } from '@mui/material'
import { useSelector } from 'react-redux'

const Notification = () => {
  const { notification, isError } = useSelector((state) => state.notification)

  if (!notification) {
    return null
  }
  
  const severity = isError ? 'error' : 'success'

  return (
    <Alert data-testid='notification' severity={severity}>
      {notification}
    </Alert>
  )
}

export default Notification