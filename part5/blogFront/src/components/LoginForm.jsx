import { useState } from 'react'
import PropTypes from 'prop-types'

const LoginForm = ({ handleLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const logIn = event => {
    event.preventDefault()

    const newUser = { username, password }
    handleLogin(newUser)

    setUsername('')
    setPassword('')
  }

  return (
    <form onSubmit={logIn}>
      <h1>Log in</h1>
      <div>
                username
        <input data-testid='username' type="text" value={username} name="Username" onChange={({ target }) => setUsername(target.value)} />
      </div>
      <div>
                password
        <input data-testid='password' type="password" value={password} name="Password" onChange={({ target }) => setPassword(target.value)} />
      </div>
      <button type="submit">login</button>
    </form>
  )
}

LoginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired
}

export default LoginForm