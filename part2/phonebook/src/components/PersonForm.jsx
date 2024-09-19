const PersonForm = ({ newName, newNumber, handleNameChange, handleNumberChange, addPerson }) => {
  return (
    <form onSubmit={addPerson}>
      <div>
        <div> name: <input value={newName} onChange={handleNameChange} /> </div>
        <div> number: <input  value={newNumber} onChange={handleNumberChange} /> </div>
        <div> <button type="submit">add</button> </div>
      </div>
    </form>
  )
}

export default PersonForm