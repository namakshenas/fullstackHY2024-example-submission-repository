const Header = (props) => {
  return (
    <h1>
    {props.course}
    </h1>
  )
}

const Content = (props) => {
  return (
    <p>
    {props.name}
    </p>
  )
}


const App = () => {
  const course = 'Half Stack application development'
  const part1 = 'Fundamentals of React'
  const part2 = 'Using props to pass data'
  const part3 = 'State of a component'

  return (
    <div>
      <Header course={course} />
      <Content name={part1}/>
      <Content name={part2}/>
      <Content name={part3}/>
    </div>
  )
}

export default App