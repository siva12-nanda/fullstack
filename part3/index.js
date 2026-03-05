

const express = require('express')
const morgan = require('morgan')

const app = express()

app.use(express.json())

// Morgan token to log POST body (Exercise 3.8)
morgan.token('body', (req) => JSON.stringify(req.body))

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

// Phonebook data
let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456"
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523"
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345"
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122"
  }
]

// GET all persons
app.get('/api/persons', (req, res) => {
  res.json(persons)
})

// GET info
app.get('/info', (req, res) => {
  const requestTime = new Date()
  res.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${requestTime}</p>
  `)
})

// GET single person
app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(p => p.id === id)

  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

// DELETE person
app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)

  res.status(204).end()
})

// POST new person (3.6 validation included)
app.post('/api/persons', (req, res) => {
  const body = req.body

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'name or number missing'
    })
  }

  if (persons.find(p => p.name === body.name)) {
    return res.status(400).json({
      error: 'name must be unique'
    })
  }

  const person = {
    id: Math.floor(Math.random() * 10000),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(person)

  res.json(person)
})

// unknown endpoint
app.use((req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})