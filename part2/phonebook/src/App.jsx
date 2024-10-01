import { useState, useEffect } from 'react'
import axios from 'axios'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import personsService from './services/persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [message, setMessage] = useState(null)

  // only initial persons are fetched using useEffect
  useEffect(() => {
    console.log('effect')
    personsService.getAll().then((initialPersons) => setPersons(initialPersons))
    console.log('promise fulfilled')
  }, [])

  const notify = (msg, type) => {
    setMessage({ msg, type })
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  const addPerson = (event) => {
    event.preventDefault()
    const nameObject = {
      name: newName,
      number: newNumber,
      id: newName,
    }

    const nameExists = persons.some(person => person.name.toLowerCase() === newName.toLowerCase())

    if (nameExists) {
      const result = window.confirm(`${newName} is already added to the phonebook, replace the old number with a new one?`)
      if (result) {
        const person = persons.find((p) => p.name.toLowerCase() === newName.toLowerCase())
        const changedPerson = { ...person, number: newNumber }
        personsService
          .update(person.id, changedPerson)
          .then((returnedPerson) => {
            setPersons(persons.map((p) => (p.id !== person.id ? p : returnedPerson)))
          })
          .catch((error) => {
            notify(error.response.data.error, 'alert')
            console.log(error.response.data)
          })
      }
      return
    }


     personsService
      .create(nameObject)
      .then((person) => {
        setPersons(persons.concat(person)),
        notify(`Added ${newName}`, 'success')
      })
      .catch((error) => {
        notify(error.response.data.error, 'alert')
        console.log(error.response.data)
      })

  }

  const personsToShow =
    filter.length === 0
      ? persons
      : persons.filter((p) =>
        p.name.toLowerCase().includes(filter.toLowerCase())
      )

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const deletePerson = (id) => {
    const person = persons.find((p) => p.id === id)
    const result = window.confirm(`Delete ${person.name}?`)
    if (result) {
      personsService
        .remove(id)
        .then(() => {
          setPersons(persons.filter((p) => p.id !== id))
          notify(`Deleted ${person.name}`, 'success')
        })
        .catch((error) => {
          notify(`Information of ${person.name} has already been removed from the server`, 'alert')
          setPersons(persons.filter((p) => p.id !== id))
          console.log(error.response.data)
        })
    }
    
    
    
    
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />
      <Filter value={filter} handleFilterChange={handleFilterChange} />
      <h2>Add new</h2>
      <PersonForm
        addPerson={addPerson}
        name={newName}
        number={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons personsToShow={personsToShow} deletePerson={deletePerson}/>
    </div>
  )
}

export default App
