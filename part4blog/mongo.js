const mongoose = require('mongoose')
const config = require('../part4blog/utils/config')
const Blog = require('./models/blog')

mongoose.set('strictQuery',false)

if (process.argv.length<3) {
    console.log('give password as argument')
    process.exit(1)
  }
  
  const password = process.argv[2]
  
  const url =
    `mongodb+srv://osuchowskijakub:${password}@cluster0.psyqnoc.mongodb.net/testBlogApp`
  
mongoose.connect(url)

const blog = new Blog({
    title: "testDB",
    author: "Kuba",
    url: "this is added using the testDB",
    likes: 10
  })

blog.save().then(result => {
  console.log('note saved!')
  mongoose.connection.close()
})
