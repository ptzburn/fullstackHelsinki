import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { logout } from '../reducers/userReducer'
import { AppBar, Box, Button, IconButton, Toolbar } from '@mui/material'

const Menu = () => {
    const user = useSelector((state) => state.user)
    const dispatch = useDispatch()
    const padding = {
        paddingRight: 5
    }
    return (
        <AppBar position="static">
            <Toolbar>
                <IconButton edge="start" color="inherit" aria-label="menu"></IconButton>
                <Button color="inherit" component={Link} to="/">Blogs</Button>
                <Button color="inherit" component={Link} to="/users">Users</Button>
                <Box sx={{ flexGrow: 1 }} />
                {user
                    ? <em>{user.name} <Button color="inherit" onClick={() => dispatch(logout())}>logout</Button></em>
                    : <Button color="inherit" component={Link} to="/login">Login</Button>
                }
            </Toolbar>
        </AppBar>
    )
}    

export default Menu