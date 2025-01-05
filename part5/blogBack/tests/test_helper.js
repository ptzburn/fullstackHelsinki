const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
    {
        "title": "Testing with REST Client",
        "author": "Milan Hokkanen",
        "url": "https:test.com",
        "likes": 10
    },
    {
        "title": "Why asynchronous functions are amazing.",
        "author": "Dr. Emil Corazón",
        "url": "https://flatline.com",
        "likes": 8
    }
]

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}

module.exports = { initialBlogs, blogsInDb, usersInDb }