const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    }
]

const listWithBlogs = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    },
    {
        _id: '5a422aa71b54a676234d17f7',
        title: 'Testing for the sake of testing',
        author: 'Saddam Hussein',
        url: 'https://bagdad.su',
        likes: 8,
        __v: 0
    },
    {
        _id: '5a422aa71b54a676234d17f6',
        title: 'LotR: Two Towers',
        author: 'George Bush',
        url: 'https://wtc.us',
        likes: 77,
        __v: 0
    }
]

const moreBlogs = [
    {
      _id: "5a422a851b54a676234d17f7",
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 7,
      __v: 0
    },
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
      __v: 0
    },
    {
      _id: "5a422b3a1b54a676234d17f9",
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
      __v: 0
    },
    {
      _id: "5a422b891b54a676234d17fa",
      title: "First class tests",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
      likes: 10,
      __v: 0
    },
    {
      _id: "5a422ba71b54a676234d17fb",
      title: "TDD harms architecture",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
      likes: 0,
      __v: 0
    },
    {
      _id: "5a422bc61b54a676234d17fc",
      title: "Type wars",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
      likes: 2,
      __v: 0
    }  
]

test('dummy returns one', () => {
    const blogs = []

    assert.strictEqual(listHelper.dummy(blogs), 1)
})

describe('total likes', () => {

    test('of empty list is zero', () => {
        assert.strictEqual(listHelper.totalLikes([]), 0)
    })
    
    test('when list has only one blog equals the likes of that', () => {
        assert.strictEqual(listHelper.totalLikes(listWithOneBlog), listWithOneBlog[0].likes)
    })
    
    test('of a bigger list is calculated right', () => {
        assert.strictEqual(listHelper.totalLikes(listWithBlogs), 90)
    })
})

describe('favorite blog', () => {

    test('of empty list produces "The blog list is empty"', () => {
        assert.strictEqual(listHelper.favoriteBlog([]), 'The blog list is empty')
    })
    
    test('when list has only one blog is the blog', () => {
        assert.deepStrictEqual(listHelper.favoriteBlog(listWithOneBlog), listWithOneBlog[0])
    })
    
    test('of a bigger list is the blog with most likes', () => {
        assert.deepStrictEqual(listHelper.favoriteBlog(listWithBlogs), listWithBlogs[2])
    })
})

describe('most blogs', () => {

    test('of empty list produces "The blog list is empty"', () => {
        assert.strictEqual(listHelper.mostBlogs([]), 'The blog list is empty')
    })

    test('when list has only one blog returns its author', () => {
        assert.deepStrictEqual(listHelper.mostBlogs(listWithOneBlog), { author: "Edsger W. Dijkstra", blogs: 1})
    })

    test('of a bigger list returns the author with most blogs', () => {
        assert.deepStrictEqual(listHelper.mostBlogs(moreBlogs), { author: "Robert C. Martin", blogs: 3})
    })

})

describe('most likes', () => {

    test('of empty list produces "The blog list is empty"', () => {
        assert.strictEqual(listHelper.mostLikes([]), 'The blog list is empty')
    })

    test('when list has only one blog returns its author', () => {
        assert.deepStrictEqual(listHelper.mostLikes(listWithOneBlog), { author: "Edsger W. Dijkstra", likes: 5})
    })

    test('of a bigger list returns the author with most likes', () => {
        assert.deepStrictEqual(listHelper.mostLikes(moreBlogs), { author: 'Edsger W. Dijkstra', likes: 17 })
    })

})