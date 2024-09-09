import { useState } from 'react'

const StatisticLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

const Statistics = ({good,neutral,bad}) => {

  if ((good + neutral + bad) === 0) {
    return (
      <div>
        No feedback given
      </div>
    )
  }

  return (
    <>
      <table>
        <tbody>
          <StatisticLine text='Good' value={good} />
          <StatisticLine text='Neutral' value={neutral} />
          <StatisticLine text='Bad' value={bad} />
          <StatisticLine text='All' value={(good+neutral+bad)} />
          <StatisticLine text='Average' value={(good+neutral+bad)/3} />
          <StatisticLine text='Positive' value={good/(good+neutral+bad) || 0} />
        </tbody>
      </table>
    </>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGoodClick = () => {
    setGood(good + 1)
  }

  const handleNeutralClick = () => {
    setNeutral(neutral + 1)
  }

  const handleBadClick = () => {
    setBad(bad + 1)
  }

  return (
    <div>
      <h1> give feedback</h1>
      <button onClick={handleGoodClick}> Good </button>
      <button onClick={handleNeutralClick}> Neutral </button>
      <button onClick={handleBadClick}> Bad </button>
      <h1> statistics </h1>
      <Statistics good={good} neutral={neutral} bad={bad}> </Statistics>
    </div>
  )
}

export default App