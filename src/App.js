import { useReducer, useEffect } from 'react';

import Header from './components/Header';
import Main from './components/Main';
import StartScreen from './components/StartScreen';
import Error from './components/Error';
import Loader from './components/Loader';
import Question from './components/Question';
import NextButton from './components/NextButton';
import Progress from './components/Progress';

const initalState = {
  questions: [],
  status: 'loading',
  index: 0,
  answer: null,
  points: 0,
};

//status:'loading', 'error', 'ready','active','finish'

function reducer(state, action) {
  console.log(state, action);
  switch (action.type) {
    case 'dataReceived':
      return { ...state, status: 'ready', questions: action.payload };
    case 'dataFailed':
      return { ...state, status: 'error' };
    case 'start':
      return { ...state, status: 'active' };
    case 'newAnswer':
      const question = state.questions.at(state.index);
      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };
    case 'nextQuestion':
      return { ...state, index: state.index + 1, answer: null };
    default:
      throw new Error('Unknown action');
  }
}
function App() {
  const [state, dispatch] = useReducer(reducer, initalState);

  const { status, questions, index, answer, points } = state;

  const numQuestions = questions.length;
  console.log(numQuestions);

  const maxPossiblePoints = questions.reduce(
    (prevPoint, currentPoint) => prevPoint + currentPoint.points,
    0,
  );

  useEffect(function () {
    fetch('http://localhost:8000/questions')
      .then((res) => res.json())
      .then((data) => dispatch({ type: 'dataReceived', payload: data }))
      .catch((err) => dispatch({ type: 'dataFailed' }));
  }, []);

  return (
    <div className='app'>
      <Header />

      <Main>
        {status === 'loading' && <Loader />}
        {status === 'error' && <Error />}
        {status === 'ready' && (
          <StartScreen dispatch={dispatch} numQuestions={numQuestions} />
        )}
        {status === 'active' && (
          <>
            <Progress
              index={index}
              numQuestions={numQuestions}
              maxPossiblePoints={maxPossiblePoints}
              points={points}
            />
            <Question
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />
            <NextButton dispatch={dispatch} answer={answer} />
          </>
        )}
      </Main>
    </div>
  );
}

export default App;
