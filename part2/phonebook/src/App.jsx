import { useState, useEffect } from 'react'
import personService from './services/persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState(null)

  useEffect(() => {
    personService.getAll().then(response => {
      setPersons(response.data)
    })
  }, [])

  const showMessage = (text, type) => {
    setMessage(text)
    setMessageType(type)
    setTimeout(() => {
      setMessage(null)
      setMessageType(null)
    }, 3000)
  }

  const addPerson = (event) => {
    event.preventDefault()

    const existing = persons.find(p => p.name === newName)

    if (existing) {
      const updatedPerson = { ...existing, number: newNumber }

      personService
        .update(existing.id, updatedPerson)
        .then(response => {
          setPersons(persons.map(p =>
            p.id !== existing.id ? p : response.data
          ))
          showMessage(`Updated ${existing.name}`, 'success')
        })
        .catch(error => {
          showMessage(
            `Information of ${existing.name} has already been removed from server`,
            'error'
          )
          setPersons(persons.filter(p => p.id !== existing.id))
        })

      return
    }

    const personObject = {
      name: newName,
      number: newNumber
    }

    personService
      .create(personObject)
      .then(response => {
        setPersons(persons.concat(response.data))
        showMessage(`Added ${newName}`, 'success')
      })

    setNewName('')
    setNewNumber('')
  }

  const deletePerson = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id))
          showMessage(`Deleted ${name}`, 'success')
        })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={message} type={messageType} />

      <form onSubmit={addPerson}>
        <div>
          name:
          <input
            value={newName}
            onChange={e => setNewName(e.target.value)}
          />
        </div>
        <div>
          number:
          <input
            value={newNumber}
            onChange={e => setNewNumber(e.target.value)}
          />
        </div>
        <button type="submit">add</button>
      </form>

      <h2>Numbers</h2>
      <ul>
        {persons.map(p =>
          <li key={p.id}>
            {p.name} {p.number}
            <button onClick={() => deletePerson(p.id, p.name)}>
              delete
            </button>
          </li>
        )}
      </ul>
    </div>
  )
}

export default App
