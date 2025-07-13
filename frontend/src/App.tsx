import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import SkillTreePage from './pages/SkillTreePage';
import PathwaysPage from './pages/PathwaysPage';
import PathfinderPage from './pages/PathfinderPage';
import ChatbotButton from './components/ChatbotButton';
import LeaderboardPage from './components/LeaderboardPage';
import ProfilePage from './pages/ProfilePage';
import SparkResultsPage from "./pages/SparkResultsPage";
import { ChatbotProvider } from './contexts/ChatbotContext';

function AppRoutes() {
  const location = useLocation();
  
  // Show chatbot on all pages except landing and login
  const shouldShowChatbot = !['/', '/login'].includes(location.pathname);
  
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/skill-tree" element={<SkillTreePage />} />
        <Route path="/pathways" element={<PathwaysPage />} />
        <Route path="/pathfinder" element={<PathfinderPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/spark-results" element={<SparkResultsPage />} />
      </Routes>
      {shouldShowChatbot && <ChatbotButton />}
    </>
  );
}

function App() {
  return (
    <ChatbotProvider>
      <Router>
        <AppRoutes />
      </Router>
    </ChatbotProvider>
  );
}

export default App;