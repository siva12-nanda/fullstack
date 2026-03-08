require('dotenv').config()
const mongoose = require('mongoose')

const url = process.env.MONGODB_URI
console.log('Connecting to', url)

mongoose.connect(url, { family: 4 })
  .then(() => {
    console.log('Connected successfully!')
    mongoose.connection.close()
  })
  .catch(err => {
    console.error('Connection error:', err.message)
  })