// phonebook-request/index.js


// phonebook-request/index.js

const BASE_URL = 'http://localhost:3001/api/persons';

// GET all persons
fetch(BASE_URL)
  .then(res => res.json())
  .then(data => {
    console.log('All entries:');
    console.log(data);
  })
  .catch(err => console.error('Error fetching:', err));

// POST a new person
const newPerson = {
  name: "Siva",
  number: "123456789"
};

fetch(BASE_URL, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(newPerson)
})
  .then(res => res.json())
  .then(data => {
    console.log('Added entry:');
    console.log(data);
  })
  .catch(err => console.error('Error posting:', err));