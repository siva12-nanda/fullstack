const Header = ({ name }) => {
  return <h2>{name}</h2>
}

const Content = ({ parts }) => {
  return (
    <div>
      {parts.map(part => (
        <p key={part.id}>
          {part.name} {part.exercises}
        </p>
      ))}
    </div>
  )
}

const Total = ({ parts }) => {
  const totalExercises = parts.reduce(
    (sum, part) => sum + part.exercises,
    0
  )

  return <strong>total of {totalExercises} exercises</strong>
}

const Course = ({ course }) => {
  return (
    <div>
      <Header name={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

export default Course
