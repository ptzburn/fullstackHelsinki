const lodash = require('lodash')

const dummy = blogs => 1

const totalLikes = blogs => {
    return blogs.length === 0
        ? 0
        : blogs.map(blog => blog.likes).reduce((val1, val2) => val1 + val2, 0)
}

const favoriteBlog = blogs => {
    const maxLikes = Math.max(...blogs.map(blog => blog.likes))
    return blogs.length === 0
        ? 'The blog list is empty'
        : blogs.find(blog => blog.likes === maxLikes)
}

const mostBlogs = blogs => {
    const authors = lodash.countBy(blogs.map(blog => blog.author))
    const mostBlogs = lodash.maxBy(Object.entries(authors), ([key, value]) => value)

    return blogs.length === 0
        ? 'The blog list is empty'
        : { author: mostBlogs[0], blogs: mostBlogs[1] }
}

const mostLikes = blogs => {
    const authors = blogs.map(blog => [blog.author, blog.likes])
    const combined = authors.reduce((combined, [author, likes]) => {
        combined[author] = (combined[author] || 0) + likes
        return combined
      }, {})
    const mostLikes = lodash.maxBy(Object.entries(combined), ([key, value]) => value)
    return blogs.length === 0
        ? 'The blog list is empty'
        : { author: mostLikes[0], likes: mostLikes[1] }
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }