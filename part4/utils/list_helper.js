const dummy = (blogs) => {
    return 1
  }
  
  const totalLikes = (blogs) => {
    return blogs.reduce((sum, b) => sum + b.likes, 0)
  }
  
  const mostLikes = (blogs) => {
    const max = blogs.reduce((max, b) => Math.max(max, b.likes), 0)
    return blogs.filter((b) => b.likes === max)
  }
  
  module.exports = {
    dummy,
    totalLikes,
    mostLikes,
  }