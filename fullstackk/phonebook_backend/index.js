require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const morgan = require('morgan')

const Person = require('./models/person')

const app = express()

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('connected to MongoDB'))
  .catch(error => console.log(error.message))

app.use(cors())
app.use(express.json())
app.use(morgan('tiny'))

// GET all persons
app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
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

// ERROR HANDLER
app.use((error, req, res, next) => {

  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  next(error)

})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})