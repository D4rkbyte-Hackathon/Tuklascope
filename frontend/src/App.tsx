import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ChatbotButton from './components/ChatbotButton';
import LeaderboardPage from './components/LeaderboardPage';
import ProfilePage from './pages/ProfilePage';
import SparkResultsPage from "./pages/SparkResultsPage";

function AppRoutes() {
  const location = useLocation();
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/spark-results" element={<SparkResultsPage />} />
      </Routes>
      {location.pathname === '/home' && <ChatbotButton />}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;