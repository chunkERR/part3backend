const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require('../models/user')

blogsRouter.get("/", (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs);
  });
});

blogsRouter.get("/:id", (request, response, next) => {
  Blog.findById(request.params.id)
    .then((blog) => {
      if (blog) {
        response.json(blog);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

blogsRouter.post("/", async (request, response, next) => {

  const body = request.body;

  const user = await User.findById(body.userId)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    pages: body.pages,
    user: user.id
  });

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)  
  await user.save()  
  response.json(savedBlog)
})

blogsRouter.delete("/:id", (request, response, next) => {
  Blog.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

blogsRouter.put("/:id", (request, response, next) => {
  const body = request.body;

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    pages: body.pages,
  };

  Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    .then((updatedBlog) => {
      response.json(updatedBlog);
    })
    .catch((error) => next(error));
});



module.exports = blogsRouter;
