const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
require('express-async-errors')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog
        .find({})
    response.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.get('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id)
    if (blog) {
        response.json(blog.toJSON())
    } else {
        response.status(404).end()
    }
})

blogsRouter.put('/:id', async (request, response) => {
    const body = request.body

    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    }

    const result = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })

    if (result) {
        response.json(result.toJSON())
    } else {
        response.status(404).end()
    }
})

blogsRouter.post('/', async (request, response) => {
    const blog = new Blog(request.body)

    if (!request.token) {
        return response.status(401).json({ error: 'token missing' })
    }
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
        return response.status(401).json({ error: 'token invalid' })
    }
    const user = await User.findById(decodedToken.id)

    blog.user = user.id

    const result = await blog.save()

    user.blogs = user.blogs.concat(result._id)
    await user.save()
    response.status(201).json(result.toJSON())
})

blogsRouter.delete('/:id', async (request, response) => {
    if (!request.token) {
        return response.status(401).json({ error: 'token missing' })
    }

    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    if (!decodedToken.id) {
        return response.status(401).json({ error: 'token invalid' })
    }
    const user = await User.findById(decodedToken.id)
    const blog = await Blog.findById(request.params.id)

    if (user.id.toString() !== blog.user.toString()) {
        return response.status(401).json({ error: 'unauthorized' })
    }

    await Blog.remove(blog)
    response.status(204).end()
})

module.exports = blogsRouter