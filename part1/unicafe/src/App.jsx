import { useState } from 'react'

const Button = ({ text, onClick }) => (
  <button onClick={onClick}>{text}</button>
)

const StatisticLine = ({ text, value }) => (
  <tr>
    <td>{text}</td>
    <td>{value}</td>
  </tr>
)

const Statistics = ({ excellent, good, neutral, bad }) => {
  const all = excellent + good + neutral + bad

  if (all === 0) {
    return <p>No feedback given</p>
  }

  const average = (excellent + good - bad) / all
  const positive = ((excellent + good) / all) * 100

  return (
    <table>
      <tbody>
        <StatisticLine text="excellent" value={excellent} />
        <StatisticLine text="good" value={good} />
        <StatisticLine text="neutral" value={neutral} />
        <StatisticLine text="bad" value={bad} />
        <StatisticLine text="all" value={all} />
        <StatisticLine text="average" value={average.toFixed(2)} />
        <StatisticLine text="positive" value={positive.toFixed(1) + ' %'} />
      </tbody>
    </table>
  )
}

const App = () => {
  const [excellent, setExcellent] = useState(0)
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>give feedback</h1>

      <Button text="excellent" onClick={() => setExcellent(excellent + 1)} />
      <Button text="good" onClick={() => setGood(good + 1)} />
      <Button text="neutral" onClick={() => setNeutral(neutral + 1)} />
      <Button text="bad" onClick={() => setBad(bad + 1)} />

      <h1>statistics</h1>

      <Statistics
        excellent={excellent}
        good={good}
        neutral={neutral}
        bad={bad}
      />
    </div>
  )
}

export default App
