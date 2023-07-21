function Progress({ index, numQuestions, maxPossiblePoints, points }) {
  return (
    <header className='progress'>
      <progress max={numQuestions} value={index} />
      <p>
        Question {index + 1} / {numQuestions}
      </p>
      <p>
        {points} / {maxPossiblePoints} points
      </p>
    </header>
  );
}

export default Progress;
