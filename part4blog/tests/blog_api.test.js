const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const config = require('../utils/config')

const api = supertest(app)

const Blog = require('../models/blog')
const helper = require('./test_helper')

mongoose.set("bufferTimeoutMS", 30000);
jest.setTimeout(10000); // 10 second timeout

beforeAll(async () => {
  
  await mongoose.disconnect();
  await mongoose.connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.disconnect();
});

test('blogs are returned as JSON', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
}, 100000);

// test('all blogs are returned', async () => {
//   const response = await api.get('/api/blogs');
//   const blogLength = response.body.length;
//   expect(response.body).toHaveLength(blogLength);
// }, 300000);

test('a specific blog is within the returned notes', async () => {
  const response = await api.get('/api/blogs');
  const contents = response.body.map((r) => r.content);
  expect(contents).toContain('HTML is easy');
});

  
  test('a valid blog can be added ', async () => {
    const newBlog = {
      title: 'async/await simplifies making async calls',    
      author: "Martynka",
      url: "haha.com",
      likes: 1000
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  
    const blogsAtEnd = await blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialNotes.length + 1)
  
    const contents = blogsAtEnd.map(b => b.content)
    expect(contents).toContain(
      'async/await simplifies making async calls'
    )
  })
  
  test('blog without content is not added', async () => {
    const newBlog = {
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  
    const blogsAtEnd = await helper.blogsInDb()
  
    expect(blogsAtEnd).toHaveLength(helper.initialNotes.length)
  })
  
  test('a specific note can be viewed', async () => {
    const blogsAtStart = await helper.blogsInDb()
  
    const blogToView = blogsAtStart[0]
  
    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  
    //const processedNoteToView = JSON.parse(JSON.stringify(noteToView))
  
    expect(resultBlog.body).toEqual(blogToView)
  })
  
  test('a note can be deleted', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]
  
    await api
      .delete(`/api/notes/${blogToDelete.id}`)
      .expect(204)
  
    const blogsAtEnd = await helper.blogsInDb()
  
    expect(blogsAtEnd).toHaveLength(
      helper.initialBlogs.length - 1
    )
  
    const contents = blogsAtEnd.map(r => r.content)
  
    expect(contents).not.toContain(blogToDelete.content)
  })
  

afterAll(async () => {
  await mongoose.connection.close()
})
