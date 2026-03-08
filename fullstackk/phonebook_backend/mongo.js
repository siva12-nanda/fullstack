require('dotenv').config()
const mongoose = require('mongoose')

// Get command-line arguments
const args = process.argv

if (args.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password> [name] [number]')
  process.exit(1)
}

const password = args[2]

// Connection URL using environment variable
const url = process.env.MONGODB_URI || `mongodb+srv://fullstack:${password}@cluster0.ofnigep.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url, { family: 4 })
  .then(() => console.log('MongoDB connected!'))
  .catch((error) => {
    console.log('Connection error:', error.message)
    process.exit(1)
  })

// Schema and Model
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

const Person = mongoose.model('Person', personSchema)

// If only password is provided, list all entries
if (args.length === 3) {
  Person.find({})
    .then(persons => {
      console.log('Phonebook:')
      persons.forEach(p => console.log(`${p.name} ${p.number}`))
      mongoose.connection.close()
    })
    .catch(err => {
      console.log('Error fetching persons:', err)
      mongoose.connection.close()
    })
}

// If name and number are provided, add a new person
if (args.length === 5) {
  const name = args[3]
  const number = args[4]

  const person = new Person({ name, number })
  person.save()
    .then(savedPerson => {
      console.log(`Added ${savedPerson.name} number ${savedPerson.number} to phonebook`)
      mongoose.connection.close()
    })
    .catch(err => {
      console.log('Error saving person:', err)
      mongoose.connection.close()
    })
}

// If wrong number of arguments
if (args.length !== 3 && args.length !== 5) {
  console.log('Usage:')
  console.log('  List all: node mongo.js <password>')
  console.log('  Add person: node mongo.js <password> "<name>" <number>')
  mongoose.connection.close()
}