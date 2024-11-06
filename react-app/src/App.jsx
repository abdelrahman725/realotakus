import QuizPage from './components/quiz_page'
import Home from './components/home';
import MyToastContainer from './components/toast';
import { Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from './components/header';

function App() {
  const [total_score, set_total_score] = useState()
  useEffect(() => {
    let initial_score = JSON.parse(localStorage.getItem("score"))
    if (initial_score === null) {
      initial_score = 0
      localStorage.setItem("score", initial_score)
    }
    set_total_score(initial_score)
  }, [])

  return (
    <div className="app">
      <MyToastContainer />
      <Header score={total_score} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/quiz" element={<QuizPage set_total_score={set_total_score} />} />
      </Routes>
    </div>
  )
}

export default App
