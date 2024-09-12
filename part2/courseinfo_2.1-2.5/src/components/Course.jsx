
const Header = ({ name }) => <h2> {name} </h2>

const Part = ({ part }) => <p> {part.name} {part.exercises} </p>

  const Content = ({ parts }) => (
    <>
      {parts.map((part) => ( <Part key={part.id} part={part} /> ))}
    </>
  )

const Total = ({ parts }) => (
        <strong> total of 
            <span> </span>
            { parts.reduce((sum, part) => sum + part.exercises, 0) }
            <span> </span>
            exercises
        </strong>
)


const Course = ({ course }) => (
      <>
        <Header name={course.name} />
        <Content parts={course.parts} />
        <Total parts={course.parts} />
      </>
    )


export default Course