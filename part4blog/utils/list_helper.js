const checkOne = (blogs) => {

    return 1 
}

module.exports = {
    checkOne
}

const totalLikes = (blogs) => {
    const allLikes = blogs.map(blog => blog.likes)
    console.log(allLikes)
}

totalLikes(blogs)

