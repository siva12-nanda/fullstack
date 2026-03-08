const mongoose = require('mongoose')

// Take password from command line
const password = process.argv[2]

// Non-SRV connection string, insert ${password}
const url = `mongodb://fullstack:${password}@ac-j7wqrwo-shard-00-00.ofnigep.mongodb.net:27017,ac-j7wqrwo-shard-00-01.ofnigep.mongodb.net:27017,ac-j7wqrwo-shard-00-02.ofnigep.mongodb.net:27017/phonebookApp?ssl=true&replicaSet=atlas-gjpw7o-shard-0&authSource=admin&retryWrites=true&w=majority`

mongoose.set('strictQuery', false)

mongoose.connect(url)
  .then(() => console.log('MongoDB connected!'))
  .catch(err => console.error('Connection error:', err))

// Optional: command line arguments for adding a person
const name = process.argv[3]
const number = process.argv[4]

if (name && number) {
  const personSchema = new mongoose.Schema({ name: String, number: String })
  const Person = mongoose.model('Person', personSchema)

  const person = new Person({ name, number })

  person.save()
    .then(doc => {
      console.log(`Added ${doc.name} number ${doc.number} to phonebook`)
      mongoose.connection.close()
    })
    .catch(err => {
      console.error(err)
      mongoose.connection.close()
    })
} else {
  console.log('No name/number provided, just connected to MongoDB.')
}