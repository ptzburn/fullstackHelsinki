const commentsRouter = require('express').Router()
const Comment = require('../models/comment')
const middleware = require('../utils/middleware')

commentsRouter.get('/', async (request, response) => {
    const comments = await Comment.find({}).populate('blog', { title: 1, author: 1, url: 1, likes: 1 })
    response.json(comments)
})

commentsRouter.post('/', middleware.blogFinder, async (request, response) => {
    const blog = request.blog

    const comment = new Comment({
        content: request.body.content,
        blog: blog.id
    })
    const savedComment = await comment.save()
    blog.comments = blog.comments.concat(savedComment._id)
    await blog.save()

    response.status(201).json(savedComment)
})

module.exports = commentsRouter