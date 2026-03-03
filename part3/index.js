

// index.js
const express = require('express')
const app = express()

app.use(express.json()) // for parsing JSON in POST requests

// Middleware: log every request (optional)
const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}
app.use(requestLogger)

// Hardcoded phonebook data
let persons = [
  { id: '1', name: 'Arto Hellas', number: '040-123456' },
  { id: '2', name: 'Ada Lovelace', number: '39-44-5323523' },
  { id: '3', name: 'Dan Abramov', number: '12-43-234345' },
  { id: '4', name: 'Mary Poppendieck', number: '39-23-6423122' }
]

// Helper function: generate unique ID
const generateId = () => {
  return String(Math.floor(Math.random() * 1000000))
}

// 3.1: GET all persons
app.get('/api/persons', (request, response) => {
  response.json(persons)
})

// 3.2: Info page
app.get('/info', (request, response) => {
  const date = new Date()
  response.send(
    `<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`
  )
})

// 3.3: GET single person by id
app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(p => p.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

// 3.4: DELETE person
app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(p => p.id !== id)
  response.status(204).end()
})

// 3.5 + 3.6: POST new person with error handling
app.post('/api/persons', (request, response) => {
  const body = request.body

  // Error if name or number is missing
  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'name or number is missing' })
  }

  // Error if name already exists
  const existingPerson = persons.find(p => p.name === body.name)
  if (existingPerson) {
    return response.status(400).json({ error: 'name must be unique' })
  }

  // Add new person
  const newPerson = {
    id: generateId(),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(newPerson)
  response.json(newPerson)
})

// Middleware: unknown endpoint
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

// Start server
const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})