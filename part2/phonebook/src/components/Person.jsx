import React from 'react';

const Person = ({ person, handleDelete }) => {
  return (
    <p>
      {person.name} {person.number}
      <button onClick={() => handleDelete(person.id, person.name)}>Delete</button>
    </p>
  );
};

export default Person;

