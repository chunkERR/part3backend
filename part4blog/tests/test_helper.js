const Blog = require('../models/blog')

const initialBlogs = [  
    {    
    title: 'HTML is easy',    
    author: "Kuba",
    url: "haha.com",
    likes: 4
    },  
    {    
      title: 'CSS is great',    
      author: "Martynka",
      url: "haha.com",
      likes: 15
  },
  ]
  

const nonExistingId = async () => {
  const blog = new Blog({ content: 'willremovethissoon' })
  await blog.save()
  await blog.deleteOne()

  return note._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialNotes, nonExistingId, blogsInDb
}