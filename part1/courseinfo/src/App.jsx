const Header = (props) => {
  return (
    <>
    {props.course}
    </>
  )
}

const App = () => {
  const course = 'Half Stack application development'

  return (
    <div>
      <Header course={course} />
    </div>
  )
}

export default App