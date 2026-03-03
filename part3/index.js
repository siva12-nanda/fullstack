

console.log("THIS FILE IS RUNNING")

const express = require('express')
const app = express()

app.use(express.json())

let persons = [
  { id: 1, name: "Arto Hellas", number: "040-123456" },
  { id: 3, name: "Dan Abramov", number: "12-43-234345" },
  { id: 4, name: "Mary Poppendieck", number: "39-23-6423122" }
]

// 3.1
app.get('/api/persons', (req, res) => {
  res.json(persons)
})

// 3.2
app.get('/info', (req, res) => {
  const peopleCount = persons.length
  const date = new Date()

  res.send(
    `<p>Phonebook has info for ${peopleCount} people</p>
     <p>${date}</p>`
  )
})

// 3.3
app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(p => p.id === id)

  if (person) {
    res.json(person)
  } else {
    res.status(404).json({ error: "person not found" })
  }
})

// 3.4
app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)
  res.status(204).end()
})

// 3.5
app.post('/api/persons', (req, res) => {
  const body = req.body

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'name or number missing'
    })
  }

  const newPerson = {
    id: Math.floor(Math.random() * 10000),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(newPerson)

  res.json(newPerson)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})