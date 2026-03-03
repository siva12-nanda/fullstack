

console.log("THIS FILE IS RUNNING")

const express = require('express')
const app = express()

// IMPORTANT: must be let (because we modify it in delete)
let persons = [
  { id: 1, name: "Arto Hellas", number: "040-123456" },
  { id: 2, name: "Ada Lovelace", number: "39-44-5323523" },
  { id: 3, name: "Dan Abramov", number: "12-43-234345" },
  { id: 4, name: "Mary Poppendieck", number: "39-23-6423122" }
]

// 3.1 - Get all persons
app.get('/api/persons', (req, res) => {
  res.json(persons)
})

// 3.2 - Info page
app.get('/info', (req, res) => {
  const peopleCount = persons.length
  const date = new Date()

  res.send(
    `<p>Phonebook has info for ${peopleCount} people</p>
     <p>${date}</p>`
  )
})

// 3.3 - Get single person by id
app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(p => p.id === id)

  if (person) {
    res.json(person)
  } else {
    res.status(404).json({ error: "person not found" })
  }
})

// 3.4 - Delete person
app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)

  persons = persons.filter(person => person.id !== id)

  res.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})