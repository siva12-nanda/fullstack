require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person') // Import Mongoose model

const app = express()

app.use(cors())
app.use(express.json())

// Morgan token to log request body
morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// ------------------ ROUTES ------------------

// GET all persons
app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

// GET single person
app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

// POST create new person
app.post('/api/persons', (req, res, next) => {
  const { name, number } = req.body

  if (!name || !number) {
    return res.status(400).json({ error: 'name or number missing' })
  }

  // Check if name already exists in DB
  Person.findOne({ name })
    .then(existingPerson => {
      if (existingPerson) {
        return res.status(400).json({ error: 'name must be unique' })
      }

      const person = new Person({ name, number })
      return person.save()
    })
    .then(savedPerson => res.json(savedPerson))
    .catch(error => next(error))
})

// DELETE person
app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(() => res.status(204).end())
    .catch(error => next(error))
})

// INFO route
app.get('/info', (req, res, next) => {
  Person.countDocuments({})
    .then(count => {
      res.send(`<p>Phonebook has info for ${count} people</p><p>${new Date()}</p>`)
    })
    .catch(error => next(error))
})

// ------------------ ERROR HANDLER ------------------
const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

app.use(errorHandler)

// ------------------ SERVER ------------------
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})