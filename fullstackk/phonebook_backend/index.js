require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())

// Morgan logging
morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res - :response-time ms :body'))

// ---------------- ROUTES ----------------

// GET all persons
app.get('/api/persons', (request, response) => {
Person.find({}).then(persons => {
response.json(persons)
})
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

// ADD new person
app.post('/api/persons', (request, response, next) => {
const body = request.body

if (!body.name || !body.number) {
return response.status(400).json({
error: 'name or number missing'
})
}

const person = new Person({
name: body.name,
number: body.number
})

person.save()
.then(savedPerson => {
response.json(savedPerson)
})
.catch(error => next(error))
})

// DELETE person
app.delete('/api/persons/:id', (request, response, next) => {
Person.findByIdAndDelete(request.params.id)
.then(() => {
response.status(204).end()
})
.catch(error => next(error))
})

// INFO route
app.get('/info', (request, response) => {
Person.countDocuments({}).then(count => {
response.send(
`<p>Phonebook has info for ${count} people</p>        <p>${new Date()}</p>`
)
})
})

// ---------------- ERROR HANDLER ----------------

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).json({ error: 'malformatted id' })
  }

  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

// ---------------- SERVER ----------------

const PORT = process.env.PORT

app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`)
})
