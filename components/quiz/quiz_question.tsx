export default function QuizComponent({ questions }) {
  return (
    <div>
      {questions.map((q, idx) => (
        <div key={idx}>
          <h2>{q.question}</h2>
          <ul>
            {q.options.map(option => (
              <li key={option}>{option}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
