const router = require('express').Router()
const Blog = require('../models/blog')

const { userExtractor } = require('../utils/middleware')

router.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })

  response.json(blogs)
})

router.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  .populate('user', { username: 1, name: 1 })
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

router.post('/', userExtractor, async (request, response) => {
  const { title, author, url, likes, } = request.body
  const blog = new Blog({
    title, 
    author, 
    url, 
    likes: likes ? likes : 0,
  })

  const user = request.user

  if (!user) {
    return response.status(401).json({ error: 'operation not permitted' })
  }

  blog.user = user._id

  let createdBlog = await blog.populate("user", { name: 1 })
  createdBlog = await blog.save()
  user.blogs = user.blogs.concat(createdBlog._id)
  await user.save()


  console.log("blog saved by ", user.name)
  console.log("saved blog is", createdBlog)
  response.status(201).json(createdBlog)
})

router.put('/:id', userExtractor, async (request, response) => {
  try {
    const blog = request.body;
    const user = request.user
    
    const updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id,
      {...blog, },
      { new: true }
    );

    console.log('Updated Blog:', updatedBlog);

    if (!updatedBlog) {
      return response.status(404).json({ error: 'Blog not found' });
    }

    response.json(updatedBlog);
  } catch (error) {
    console.error('Error updating blog:', error);
    response.status(500).json({ error: 'An error occurred while updating the blog' });
  }
});

router.delete('/:id', userExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id)

  const user = request.user

  if (!user || blog.user.toString() !== user.id.toString()) {
    return response.status(401).json({ error: 'operation not permitted' })
  }

  user.blogs = user.blogs.filter(b => b.toString() !== blog.id.toString() )

  await user.save()
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

module.exports = router