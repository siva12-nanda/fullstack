
 require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const morgan = require('morgan')

const Person = require('./models/person')

const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan('tiny'))

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('connected to MongoDB'))
  .catch(error => console.log(error.message))

// GET all persons
app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => res.json(persons))
})

// GET by id
app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) res.json(person)
      else res.status(404).end()
    })
    .catch(error => next(error))
})

// ADD person
app.post('/api/persons', (req, res, next) => {

  const person = new Person({
    name: req.body.name,
    number: req.body.number
  })

  person.save()
    .then(savedPerson => res.json(savedPerson))
    .catch(error => next(error))

})

// DELETE
app.delete('/api/persons/:id', (req, res, next) => {

  Person.findByIdAndDelete(req.params.id)
    .then(() => res.status(204).end())
    .catch(error => next(error))

})

// UPDATE (3.21)
app.put('/api/persons/:id', (req, res, next) => {

  const { name, number } = req.body

  Person.findByIdAndUpdate(
    req.params.id,
    { name, number },
    {
      new: true,
      runValidators: true,
      context: 'query'
    }
  )
    .then(updatedPerson => res.json(updatedPerson))
    .catch(error => next(error))

})

// ERROR HANDLER
app.use((error, req, res, next) => {

  if (error.name === 'CastError') {
    return res.status(400).json({ error: 'malformatted id' })
  }

  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  next(error)
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})