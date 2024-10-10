const listHelper = require('../utils/list_helper')

const listWithOneBlog = [
    {
        id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5
    }
]

const blogs = [
    {
        id: '5a422a851b54a676234d17f7',
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 7
    },
    {
        id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5
    },
    {
        id: '5a422b3a1b54a676234d17f9',
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
        likes: 12
    },
    {
        id: '5a422b891b54a676234d17fa',
        title: 'First class tests',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
        likes: 10
    },
    {
        id: '5a422ba71b54a676234d17fb',
        title: 'TDD harms architecture',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
        likes: 0
    },
    {
        id: '5a422bc61b54a676234d17fc',
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        likes: 2
    }
]

describe('dummy tests', () => {
    test('dummy returns one', () => {
        const blogs = []
        const result = listHelper.dummy(blogs)
        expect(result).toBe(1)
    })
})

describe('total likes', () => {
    test('when list has only one blog equals the likes of that', () => {
        const result = listHelper.totalLikes(listWithOneBlog)
        expect(result).toBe(5)
    })

    test('when list has many blogs equals the sum of likes', () => {
        const result = listHelper.totalLikes(blogs)
        expect(result).toBe(36)
    })

    test('when list is empty is zero', () => {
        const result = listHelper.totalLikes([])
        expect(result).toBe(0)
    })
})

describe('favorite blog', () => {

    test('return first blog when there is only one', () => {
        const result = listHelper.favoriteBlog(listWithOneBlog)
        const expected = {
            title: listWithOneBlog[0].title,
            author: listWithOneBlog[0].author,
            likes: listWithOneBlog[0].likes,
        }
        expect(result).toEqual(expected)
    })

    test('return blog with most likes when provided list of blogs', () => {
        const result = listHelper.favoriteBlog(blogs)
        const expected = {
            title: blogs[2].title,
            author: blogs[2].author,
            likes: blogs[2].likes,
        }
        expect(result).toEqual(expected)
    })
})

describe('Author with most blogs', () => {
    test('when blogs count is one', () => {
        const result = listHelper.mostBlogs(listWithOneBlog)
        const expected = {
            author: listWithOneBlog[0].author,
            blogs: 1
        }
        expect(result).toEqual(expected)
    })

    test('return author with most blogs when provided list of blogs', () => {
        const result = listHelper.mostBlogs(blogs)
        const expected = {
            author: blogs[3].author,
            blogs: 3
        }
        expect(result).toEqual(expected)
    })
})
describe('Author with most liked blog', () => {
    test('return author when provided one blog', () => {
        const result = listHelper.mostLikes(listWithOneBlog)
        const expected = {
            author: listWithOneBlog[0].author,
            likes: listWithOneBlog[0].likes
        }
        expect(result).toEqual(expected)
    })

    test('return author with most likes when provided list of blogs', () => {
        const result = listHelper.mostLikes(blogs)
        const expected = {
            author: blogs[1].author,
            likes: 17
        }
        expect(result).toEqual(expected)
    })
})