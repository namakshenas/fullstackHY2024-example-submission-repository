const _ = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((sum, next) => {
        return sum + next.likes
    }, 0)
}

const favoriteBlog = (blogs) => {
    const index = blogs
        .reduce((iMax, x, i, arr) => x.likes > arr[iMax].likes ? i : iMax, 0)

    const obj = blogs[index]
    return {
        title: obj.title,
        author: obj.author,
        likes: obj.likes
    }
}

const mostBlogs = (blogs) => {
    const group = _.groupBy(blogs, 'author')
    const authorsWithSumOfBlogs = _.map(_.keys(group), (e) => {
        return { author: e, blogs: group[e].length }
    })

    return _.maxBy(authorsWithSumOfBlogs, (x) => {
        return x.blogs
    })
}

const mostLikes = (blogs) => {
    const group = _.groupBy(blogs, 'author')

    const authorsWithSumOfLikes = _.map(_.keys(group), (e) => {
        const likes = group[e].reduce((sum, next) => {
            return sum + next.likes
        }, 0)
        return { author: e, likes: likes }
    })

    return _.maxBy(authorsWithSumOfLikes, (x) => {
        return x.likes
    })
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}