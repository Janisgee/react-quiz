import { useReducer, useEffect } from 'react';

import Header from './components/Header';
import Main from './components/Main';
import StartScreen from './components/StartScreen';

const initalState = { questions: [], status: 'loading' };

//status:'loading', 'error', 'ready','active','finish'

function reducer(state, action) {
  console.log(state, action);
  switch (action.type) {
    case 'dataReceived':
      return { ...state, status: 'ready' };
    default:
      throw new Error('Unknown action');
  }
}
function App() {
  const [state, dispatch] = useReducer(reducer, initalState);

  useEffect(function () {
    fetch('http://localhost:8000/questions')
      .then((res) => res.json())
      .then((data) => dispatch({ type: 'dataReceived', payload: data }));
  }, []);

  return (
    <div className='app'>
      <Header />
      <Main>{state.status === 'ready' && <StartScreen />}</Main>
    </div>
  );
}

export default App;
