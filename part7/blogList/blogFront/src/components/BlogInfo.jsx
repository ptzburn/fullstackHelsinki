import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { like, remove } from "../reducers/blogsReducer"
import { fetchUsers } from "../reducers/usersReducer"
import { useEffect } from "react"
import CommentForm from "./CommentForm"
import { Paper, Table, TableHead, TableBody, TableCell, TableContainer, TableRow, Button } from '@mui/material'

const BlogInfo = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    useEffect(() => {
        dispatch(fetchUsers())
    }, [])
    const id = useParams().id
    const blogs = useSelector((state) => state.blogs)
    const users = useSelector((state) => state.users)
    const loggedUser = useSelector((state) => state.user)
    const blog = blogs.find(n => n.id === id)
    const blogAddedBy = blog.user?.username ? blog.user : users.find(n => n.id === blog.user)

    const isAddedByUser = () => {
        if (!loggedUser) return false
        return blogAddedBy.username === loggedUser.username
    }

    const handleRemove = blog => {
        try {
            dispatch(remove(blog))
            navigate('/')
        } catch (exception) {}
    }

    if (!blog) return null
    return (
        <div>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <strong>Title</strong>
                            </TableCell>
                            <TableCell>
                                <strong>Author</strong>
                            </TableCell>
                            <TableCell>
                                <strong>Source</strong>
                            </TableCell>
                            <TableCell>
                                <strong>Added by</strong>
                            </TableCell>
                            <TableCell>
                                <Button color='primary' variant='contained' onClick={() => dispatch(like(blog))}>Like</Button>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>
                                {blog.title}
                            </TableCell>
                            <TableCell>
                                {blog.author}
                            </TableCell>
                            <TableCell>
                                <a href={blog.url}>{blog.url}</a>
                            </TableCell>
                            <TableCell>
                                {blogAddedBy.name}
                            </TableCell>
                            <TableCell>
                                {blog.likes}
                            </TableCell>
                        </TableRow>
                        {isAddedByUser() && (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    <Button
                                        color="warning"
                                        variant="contained"
                                        onClick={() => handleRemove(blog)}
                                        fullWidth
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <h1>Comments</h1>
            <CommentForm />
            <TableContainer component={Paper}>
                <Table>
                    <TableBody>
                        {blog.comments.map(comment =>
                            <TableRow key={comment.id}>
                                <TableCell>
                                    {comment.content}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

export default BlogInfo