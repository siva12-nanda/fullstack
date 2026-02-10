import React, { useState, useEffect } from 'react';
import personsService from './services/persons';
import Person from './components/Person.jsx';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');

  // Fetch initial data
  useEffect(() => {
    personsService.getAll()
      .then(initialPersons => setPersons(initialPersons))
      .catch(error => console.error('Fetch failed', error));
  }, []);

  // Add or update person
  const handleAddPerson = (event) => {
    event.preventDefault();
    const existingPerson = persons.find(p => p.name === newName);

    if (existingPerson) {
      if (window.confirm(`${newName} is already added. Replace the old number?`)) {
        const updatedPerson = { ...existingPerson, number: newNumber };
        personsService.update(existingPerson.id, updatedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(p => p.id !== existingPerson.id ? p : returnedPerson));
            setNewName('');
            setNewNumber('');
          })
          .catch(error => console.error('Update failed', error));
      }
    } else {
      const newPerson = { name: newName, number: newNumber };
      personsService.create(newPerson)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson));
          setNewName('');
          setNewNumber('');
        })
        .catch(error => console.error('Creation failed', error));
    }
  };

  // Delete person
  const handleDelete = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personsService.remove(id)
        .then(() => setPersons(persons.filter(p => p.id !== id)))
        .catch(error => console.error('Delete failed', error));
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={handleAddPerson}>
        <div>
          Name: <input value={newName} onChange={e => setNewName(e.target.value)} />
        </div>
        <div>
          Number: <input value={newNumber} onChange={e => setNewNumber(e.target.value)} />
        </div>
        <button type="submit">Add</button>
      </form>

      <h3>Numbers</h3>
      {persons.map(person => (
        <Person key={person.id} person={person} handleDelete={handleDelete} />
      ))}
    </div>
  );
};

export default App;
