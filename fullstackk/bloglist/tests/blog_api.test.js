const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

const initialBlogs = [
  {
    title: 'First blog',
    author: 'Siva',
    url: 'http://blog1.com',
    likes: 5
  },
  {
    title: 'Second blog',
    author: 'Nanda',
    url: 'http://blog2.com',
    likes: 3
  }
]

beforeEach(async () => {
  await Blog.deleteMany({})

  for (let blog of initialBlogs) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, initialBlogs.length)
})

test('unique identifier property is id', async () => {
  const response = await api.get('/api/blogs')

  assert(response.body[0].id)
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'Async testing',
    author: 'Tester',
    url: 'http://test.com',
    likes: 7
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, initialBlogs.length + 1)
})

test('if likes missing default is 0', async () => {
  const newBlog = {
    title: 'No likes blog',
    author: 'Tester',
    url: 'http://nolikes.com'
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)

  assert.strictEqual(response.body.likes, 0)
})

test('blog without title is not added', async () => {
  const newBlog = {
    author: 'Tester',
    url: 'http://fail.com'
  }

  await api.post('/api/blogs').send(newBlog).expect(400)
})

test('blog without url is not added', async () => {
  const newBlog = {
    title: 'Missing URL',
    author: 'Tester'
  }

  await api.post('/api/blogs').send(newBlog).expect(400)
})
test('a blog can be deleted', async () => {
  const blogsAtStart = await api.get('/api/blogs')
  const blogToDelete = blogsAtStart.body[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAtEnd = await api.get('/api/blogs')

  assert.strictEqual(
    blogsAtEnd.body.length,
    initialBlogs.length - 1
  )
})
test('a blog likes can be updated', async () => {
  const blogsAtStart = await api.get('/api/blogs')
  const blogToUpdate = blogsAtStart.body[0]

  const updatedBlog = {
    ...blogToUpdate,
    likes: blogToUpdate.likes + 10
  }

  const response = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedBlog)
    .expect(200)

  assert.strictEqual(response.body.likes, blogToUpdate.likes + 10)
})

after(async () => {
  await mongoose.connection.close()
})