import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Paper, Table, TableHead, TableBody, TableCell, TableContainer, TableRow, Button } from '@mui/material'

const User = () => {
    const id = useParams().id
    const users = useSelector((state) => state.users)
    const user = users.find(n => n.id === id)
    const blogs = user.blogs
    if (!user) return null
    return (
        <div>
            <h1>{user.name}</h1>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <strong>Added Blogs</strong>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {blogs.map(blog =>
                            <TableRow key={blog.id}>
                                <TableCell>
                                    {blog.title}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

export default User