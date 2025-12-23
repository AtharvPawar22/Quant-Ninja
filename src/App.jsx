import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Course from './pages/Course';
import PatternRecognition from './pages/PatternRecognition';
import NotesQuiz from './pages/NotesQuiz';
import QuantArcade from './pages/QuantArcade';
import Classic1v1 from './pages/Classic1v1';
import ChallengeFriend from './pages/ChallengeFriend';

import './index.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/course" element={<Course />} />
          <Route path="/pattern-recognition" element={<PatternRecognition />} />
          <Route path="/notes-quiz" element={<NotesQuiz />} />
          <Route path="/arcade" element={<QuantArcade />} />
          <Route path="/arcade/classic-1v1" element={<Classic1v1 />} />
          <Route path="/arcade/challenge-friend" element={<ChallengeFriend />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
