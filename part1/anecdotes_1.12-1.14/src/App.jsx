import { useState } from 'react'

const randomIntFromInterval = (min, max) => { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}

const getMax = (arr) => {
  return Object.keys(arr).reduce((a, b) => (arr[a] > arr[b] ? a : b));
}

const Anecdote = ({ text, vote }) => (
  <>
    {text}
    <div>has {vote} votes</div>
  </>
)

const anecdotes = [
  'If it hurts, do it more often.',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
  'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
  'The only way to go fast, is to go well.'
]

const points = new Array(anecdotes.length).fill(0);
const copyPoints = { ...points }

const App = () => {
   
  const [selected, setSelected] = useState(0)

  const handleSelectedClick = () => {
    setSelected(randomIntFromInterval(0, anecdotes.length))
  }

  const handleVoteClick = () => {
    copyPoints[selected] += 1
  }
  
  console.log(selected)
  console.log(copyPoints)

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <Anecdote text={anecdotes[selected]} vote={copyPoints[selected]} />
      <button onClick={handleSelectedClick}> next anecdote </button>
      <button onClick={handleVoteClick}> vote </button>
      <h1>Anecdote with most votes</h1>
      <Anecdote text={anecdotes[getMax(copyPoints)]} vote={copyPoints[getMax(copyPoints)]} />
    </div>
  )
}

export default App