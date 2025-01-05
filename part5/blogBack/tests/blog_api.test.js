const bcrypt = require('bcrypt')
const User = require('../models/user')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const assert = require('node:assert')

const Blog = require('../models/blog')

const api = supertest(app)


describe('when there is initially some blogs saved', () => {
    beforeEach(async () => {
        await Blog.deleteMany({})
    
        for (let blog of helper.initialBlogs) {
            let blogObject = new Blog(blog)
            await blogObject.save()
        }
    })
    
    test('the right number of blogs returned as json', async () => {
        const response = await api.get('/api/blogs')
                .expect(200)
                .expect('Content-Type', /application\/json/)
    
        assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })
    
    test('the name of the unique identifier of each is "id"', async () => {
        const blogs = await helper.blogsInDb()
        for (let blog of blogs) {
            assert(!blog._id && blog.id)
        }
    })
    
    describe('posting a new blog when authorized', () => {
        let token
        beforeEach(async () => {
            await User.deleteMany({})
    
            const passwordHash = await bcrypt.hash('sekret', 10)
            const user = new User({ username: 'root', passwordHash })
    
            await user.save()

            const response = await api
                .post('/api/login')
                .send({ username: 'root', password: 'sekret' })
                .expect(200)
                .expect('Content-Type', /application\/json/)
            
            token = response.body.token
        })
        test('succeeds with valid data', async () => {
            const newBlog = {
                "title": "Mein test",
                "author": "Rudolf Hickler",
                "url": "https://thirdtest.de",
                "likes": 2
            }
        
            await api
                .post('/api/blogs')
                .set('Authorization', `Bearer ${token}`)
                .send(newBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/)
        
            const blogsAtEnd = await helper.blogsInDb()
            assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
        
            const titles = blogsAtEnd.map(blog => blog.title)
            assert(titles.includes('Mein test'))
        })
        
        test('succeeds if likes -key is missing (zero value assigned)', async () => {
            const newBlog = {
                "title": "Building skyscrapers in NYC",
                "author": "Fortunate Son",
                "url": "https://president.us"
            }
        
            await api
                .post('/api/blogs')
                .set('Authorization', `Bearer ${token}`)
                .send(newBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/)
        
            const blogsAtEnd = await helper.blogsInDb()
            assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
            assert.strictEqual(blogsAtEnd[blogsAtEnd.length - 1].likes, 0)
        })
        
        test('fails with status code 400 Bad Request when required "title" and "url" properties are missing', async () => {
            const newBlog = {
                "author": "Invalid Disabled",
                "likes": 1
            }
        
            await api
                .post('/api/blogs')
                .set('Authorization', `Bearer ${token}`)
                .send(newBlog)
                .expect(400)
        
            const blogsAtEnd = await helper.blogsInDb()
            assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
        
            const authors = blogsAtEnd.map(blog => blog.author)
            assert(!authors.includes('Invalid Disabled'))
        })
    })
    describe('posting a new blog when not authorized', () => {
        test('fails with valid data', async () => {
            const newBlog = {
                "title": "Mein test",
                "author": "Rudolf Hickler",
                "url": "https://thirdtest.de",
                "likes": 2
            }
        
            await api
                .post('/api/blogs')
                .send(newBlog)
                .expect(401)
                .expect('Content-Type', /application\/json/)
        
            const blogsAtEnd = await helper.blogsInDb()
            assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
        
            const titles = blogsAtEnd.map(blog => blog.title)
            assert(!titles.includes('Mein test'))
        })
    })
    describe('deletion of a blog when authorized', () => {
        let token
        beforeEach(async () => {
            await User.deleteMany({})
    
            const passwordHash = await bcrypt.hash('sekret', 10)
            const user = new User({ username: 'root', passwordHash })
    
            await user.save()

            const response = await api
                .post('/api/login')
                .send({ username: 'root', password: 'sekret' })
                .expect(200)
                .expect('Content-Type', /application\/json/)
            
            token = response.body.token
        })
        test('succeeds with status code 204 if id is valid', async () => {
            const newBlog = {
                "title": "Mein test",
                "author": "Rudolf Hickler",
                "url": "https://thirdtest.de",
                "likes": 2
            }
        
            await api
                .post('/api/blogs')
                .set('Authorization', `Bearer ${token}`)
                .send(newBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/)
            
            const blogsAfterPosting = await helper.blogsInDb()
            const blogToDelete = blogsAfterPosting[2]

            await api
                .delete(`/api/blogs/${blogToDelete.id}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(204)
        
            const blogsAtEnd = await helper.blogsInDb()
            assert.strictEqual(blogsAtEnd.length, blogsAfterPosting.length - 1)
        
            const authors = blogsAtEnd.map(blog => blog.author)
            assert(!authors.includes(blogToDelete.author))
        })
    })
    
    describe('updating a blog', () => {
        test('succeeds if id is valid', async () => {
            const blogsAtStart = await helper.blogsInDb()
            const blogToUpdate = {
                title: "Updated blog title",
                author: blogsAtStart[0].author,
                url: blogsAtStart[0].url,
                likes: 12
            }
        
            await api
                .put(`/api/blogs/${blogsAtStart[0].id}`)
                .send(blogToUpdate)
                .expect(200)
            
            const blogsAtEnd = await helper.blogsInDb()
            assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
            
            const titles = blogsAtEnd.map(blog => blog.title)
            assert(!titles.includes(blogsAtStart[0].title))
        
        })
    })
})

describe('when there is initially one user in db', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({ username: 'root', passwordHash })

        await user.save()
    })

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'ptzburn',
            name: 'Milan Hokkanen',
            password: 'salainen'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

        const usernames = usersAtEnd.map(user => user.username)
        assert(usernames.includes(newUser.username))
    })

    test('creation fails with proper statuscode and message if username already taken', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'root',
            name: 'Superuser',
            password: 'salainen'
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert(result.body.error.includes('expected `username` to be unique'))

        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('creation fails with proper statuscode and message if username is not defined', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            name: "Jorma Mansikka",
            password: "secret"
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert(result.body.error.includes('Path `username` is required'))

        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('creation fails with proper statuscode and message if username is too short', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: "jm",
            name: "Jorma Mansikka",
            password: "secret"
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert(result.body.error.includes("(`" + `${newUser.username}` + "`) is shorter than the minimum allowed length"))

        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('creation fails with proper statuscode and message if password is not defined', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: "jman",
            name: "Jorma Mansikka"
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert(result.body.error.includes('Password is missing.'))

        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('creation fails with proper statuscode and message if password is too short', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: "jman",
            name: "Jorma Mansikka",
            password: 'pw'
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert(result.body.error.includes('Password is shorter than the minimum allowed length'))

        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })
})

after(async () => {
    await mongoose.connection.close()
})