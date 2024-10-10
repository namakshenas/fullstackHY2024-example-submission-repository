const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
    await User.deleteMany({})
    await Blog.deleteMany({})

    await createTestUser()

    const blogObjects = helper.initialBlogs
        .map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
})

const createTestUser = async () => {
    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })
    helper.initialBlogs = helper.initialBlogs.map(x => {
        x.user = user.id.toString()
        return x
    })
    await user.save()
}

const getToken = async (usrname, pwd) => {
    const username = usrname || 'root'
    const password = pwd || 'sekret'
    const result = await api
        .post('/api/login')
        .send({
            username: username,
            password: password
        })
        .expect(200)
        .expect('Content-Type', /application\/json/)

    return result.body.token
}

describe('viewing all blogs', () => {
    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs')
        expect(response.body).toHaveLength(helper.initialBlogs.length)
    })
})

describe('viewing specific blog', () => {
    test('a specific blog is within the returned blogs', async () => {
        const response = await api.get('/api/blogs')
        const title = response.body.map(r => r.title)

        expect(title).toContain(helper.initialBlogs[1].title)
    })

    test('a blog has id field', async () => {
        const response = await api.get('/api/blogs')
        response.body.forEach(x => expect(x.id).toBeDefined())
    })

    test('a single blog can be retrieved', async () => {
        const blogs = await helper.blogsInDB()
        const blog = blogs[0]
        const response = await api
            .get(`/api/blogs/${blog.id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        expect(response.body).toEqual(blog)
    })

    test('with invalid id returns 400', async () => {
        await api
            .get('/api/blogs/abc')
            .expect(400)
            .expect('Content-Type', /application\/json/)
    })
    test('with not found id returns 404', async () => {
        await api
            .get('/api/blogs/5ff2f10e97ca813c709c6822')
            .expect(404)
    })
})

describe('blog is removed', () => {
    test('succeeds with 204', async () => {
        const blogsAtStart = await helper.blogsInDB()
        const blog = blogsAtStart[0]

        const token = await getToken()

        await api
            .delete(`/api/blogs/${blog.id}`)
            .set({ 'Authorization': `BEARER ${token}` })
            .expect(204)

        const blogsAtEnd = await helper.blogsInDB()

        expect(blogsAtEnd.length).toBe(helper.initialBlogs.length - 1)

        const title = blogsAtEnd.map(r => r.title)

        expect(title).not.toContain(blog.title)
    })

    test('will fail with 401 if without token', async () => {
        const blogsAtStart = await helper.blogsInDB()
        const blog = blogsAtStart[0]

        await api
            .delete(`/api/blogs/${blog.id}`)
            .expect(401)
    })

    test('will fail with 401 if tried to remove another user blog', async () => {
        const blogsAtStart = await helper.blogsInDB()
        const blog = blogsAtStart[0]

        const username = 'tester'
        const password = 'sekret'
        const passwordHash = await bcrypt.hash(password, 10)
        const user = new User({ username: username, passwordHash })
        await user.save()

        const token = await getToken(username, password)

        await api
            .delete(`/api/blogs/${blog.id}`)
            .set({ 'Authorization': `BEARER ${token}` })
            .expect(401)
    })
})

describe('adding new blogs', () => {
    test('adding a blog will increase blog count by one', async () => {
        const newBlog = {
            title: 'React',
            author: 'Michael',
            url: 'https://google.com/',
            likes: 7111
        }

        const token = await getToken()

        await api
            .post('/api/blogs')
            .set({ 'Authorization': `BEARER ${token}` })
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const response = await api.get('/api/blogs')
        expect(response.body).toHaveLength(helper.initialBlogs.length + 1)

        const title = response.body.map(r => r.title)

        expect(title).toContain(newBlog.title)
    })

    test('adding a blog with no likes will set likes to 0', async () => {
        const newBlog = {
            title: 'React',
            author: 'Michael',
            url: 'https://google.com/'
        }

        const token = await getToken()

        const createdObject = await api
            .post('/api/blogs')
            .set({ 'Authorization': `BEARER ${token}` })
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const response = await api.get('/api/blogs')
        const value = response.body.find(x => x.id === createdObject.body.id)
        expect(value.likes).toBe(0)
    })

    test('adding a blog with no title or url will return 400', async () => {
        const newBlog = {
            author: 'Michael'
        }

        const token = await getToken()

        await api
            .post('/api/blogs')
            .set({ 'Authorization': `BEARER ${token}` })
            .send(newBlog)
            .expect(400)
            .expect('Content-Type', /application\/json/)

    })

    test('adding a blog with no title will return 400', async () => {
        const newBlog = {
            author: 'Michael',
            url: 'https://www.google.fi'
        }

        const token = await getToken()
        await api
            .post('/api/blogs')
            .set({ 'Authorization': `BEARER ${token}` })
            .send(newBlog)
            .expect(400)
            .expect('Content-Type', /application\/json/)

    })

    test('adding a blog with no url will return 400', async () => {
        const newBlog = {
            author: 'Michael',
            title: 'React'
        }

        const token = await getToken()
        await api
            .post('/api/blogs')
            .set({ 'Authorization': `BEARER ${token}` })
            .send(newBlog)
            .expect(400)
            .expect('Content-Type', /application\/json/)
    })
})

describe('updating a blog', () => {
    test('updating single blog should be successful', async () => {
        const blogsAtStart = await helper.blogsInDB()
        const blog = blogsAtStart[0]

        const newTitle = 'tester'
        blog.title = newTitle

        const result = await api
            .put(`/api/blogs/${blog.id}`)
            .send(blog)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        expect(result.body).toEqual(blog)
    })

    test('if blog with provided id not found then return 404', async () => {
        const newBlog = {
            id: '5ff2f10e97ca813c709c6822',
            author: 'Michael',
            title: 'React'
        }

        await api
            .put(`/api/blogs/${newBlog.id}`)
            .send(newBlog)
            .expect(404)
    })

    test('blog with invalid id returns 400', async () => {
        const newBlog = {
            id: 'abc',
            author: 'Michael',
            title: 'React'
        }

        await api
            .put(`/api/blogs/${newBlog.id}`)
            .send(newBlog)
            .expect(400)
            .expect('Content-Type', /application\/json/)
    })
})

describe('when there is initially one user at db', () => {
    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'testi',
            name: 'Testi Tunnus',
            password: 'salainen',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        expect(usernames).toContain(newUser.username)
    })

    test('creation fails with proper statuscode and message if username already taken', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'root',
            name: 'Superuser',
            password: 'salainen',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('Username must be unique')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('creation fails with proper statuscode and message if password is too short', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'root',
            name: 'Superuser',
            password: 'a',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('Password is too short')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })
})

afterAll(() => {
    mongoose.connection.close()
})