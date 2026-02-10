import React, { useState, useEffect } from 'react';
import personsService from './services/persons';
import Person from './components/Person.jsx';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [notification, setNotification] = useState(null);

  // Fetch initial data from backend
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
            setNotification(`Updated ${returnedPerson.name}'s number`);
            setTimeout(() => setNotification(null), 5000);
          })
          .catch(error => {
            console.error('Update failed', error);
            setNotification(`Failed to update ${existingPerson.name}`);
            setTimeout(() => setNotification(null), 5000);
          });
      }
    } else {
      const newPerson = { name: newName, number: newNumber };
      personsService.create(newPerson)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson));
          setNewName('');
          setNewNumber('');
          setNotification(`Added ${returnedPerson.name}`);
          setTimeout(() => setNotification(null), 5000);
        })
        .catch(error => {
          console.error('Creation failed', error);
          setNotification(`Failed to add ${newPerson.name}`);
          setTimeout(() => setNotification(null), 5000);
        });
    }
  };

  // Delete person
  const handleDelete = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personsService.remove(id)
        .then(() => setPersons(persons.filter(p => p.id !== id)))
        .catch(error => {
          console.error('Delete failed', error);
          setNotification(`Failed to delete ${name}`);
          setTimeout(() => setNotification(null), 5000);
        });
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>

      {/* Notification */}
      {notification && (
        <div style={{
          color: 'green',
          background: 'lightgrey',
          fontSize: 20,
          borderStyle: 'solid',
          borderRadius: 5,
          padding: 10,
          marginBottom: 10
        }}>
          {notification}
        </div>
      )}

      {/* Form to add / update */}
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
