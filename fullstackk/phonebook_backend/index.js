// index.js
require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
const Person = require('./models/person')

// Middleware
app.use(cors())
app.use(express.json())

// Morgan token to log request body
morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// GET all persons
app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then(persons => response.json(persons))
    .catch(error => next(error))
})

// GET single person
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

// POST create new person
app.post('/api/persons', (request, response, next) => {
  const { name, number } = request.body

  if (!name || !number) {
    return response.status(400).json({ error: 'name or number missing' })
  }

  const person = new Person({ name, number })

  person.save()
    .then(savedPerson => response.json(savedPerson))
    .catch(error => next(error))
})

// DELETE person
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => response.status(204).end())
    .catch(error => next(error))
})

// INFO route
app.get('/info', (request, response, next) => {
  Person.countDocuments({})
    .then(count => {
      const date = new Date()
      response.send(`
        <p>Phonebook has info for ${count} people</p>
        <p>${date}</p>
      `)
    })
    .catch(error => next(error))
})

// Unknown endpoint middleware
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

// Error handling middleware
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}
app.use(errorHandler)

// Start server
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})