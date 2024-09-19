import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas' }
  ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  const addPerson = (event) => {
    event.preventDefault()
    const nameObject = {
      name: newName,
      number: newNumber,
      id: newName,
    }

    const nameExists = persons.some(person => person.name.toLowerCase() === newName.toLowerCase())
    
    if (nameExists) {
      alert(`${newName} is already added to the phonebook.`)
      setNewName('')
      setNewNumber('') 
      return
    } 

    setPersons(persons.concat(nameObject))
    setNewName('')
    setNewNumber('') 
  }

  const personsToShow = persons.filter(person => person.name)


  const Persons = ({ personsToShow }) => {
    return (
      <ul>
        {personsToShow.map((person) => (
          <li key={person.id}>
            {person.name} {person.number}
          </li>
        ))}
      </ul>
    )
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addPerson}>
        <div>
          <div> name: <input value={newName} onChange={handleNameChange} /> </div>
          <div> number: <input  value={newNumber} onChange={handleNumberChange} /> </div>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <Persons personsToShow={personsToShow} />
    </div>
  )
}

export default App
