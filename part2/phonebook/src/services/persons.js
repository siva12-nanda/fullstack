import axios from 'axios';
const baseUrl = 'http://localhost:3001/persons';

// GET all persons
const getAll = () => axios.get(baseUrl).then(res => res.data);

// POST new person
const create = (person) => axios.post(baseUrl, person).then(res => res.data);

// PUT (update) existing person
const update = (id, updatedPerson) => axios.put(`${baseUrl}/${id}`, updatedPerson).then(res => res.data);

// DELETE a person
const remove = (id) => axios.delete(`${baseUrl}/${id}`);

export default { getAll, create, update, remove };
