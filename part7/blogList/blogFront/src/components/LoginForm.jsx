import { useState } from 'react'
import PropTypes from 'prop-types'
import { loginUser } from '../reducers/userReducer'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Button, TextField } from '@mui/material'

const LoginForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const logIn = async event => {
    event.preventDefault()
    try {
      const newUser = { username, password }
      await dispatch(loginUser(newUser))
      setUsername('')
      setPassword('')
      navigate('/')
    } catch (error) {}
  }

  return (
    <form onSubmit={logIn}>
      <h1>Log in</h1>
      <div>
        <TextField label="Username" data-test-id='username' type="text" value={username} name="Username" onChange={({ target }) => setUsername(target.value)} />
      </div>
      <br />
      <div>
        <TextField label="Password" type='password' data-testid='password' value={password} name="Password" onChange={({ target }) => setPassword(target.value)} />
      </div>
      <br />
      <Button variant="contained" color="primary" type="submit">
        Log in
      </Button>
    </form>
  )
}

/*LoginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired
}*/

export default LoginForm