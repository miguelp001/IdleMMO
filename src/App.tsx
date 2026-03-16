
import { Routes, Route } from 'react-router-dom';
import { GameProvider } from './context/GameContext';
import { CharacterCreation } from './components/CharacterCreation';
import { GameDashboard } from './components/GameDashboard';
import { NotificationContainer } from './components/NotificationContainer';
import './App.css';

function App() {
  return (
    <GameProvider>
      <div className="App bg-gradient-fantasy min-h-screen">
        <NotificationContainer />
        <Routes>
          <Route path="/" element={<CharacterCreation />} />
          <Route path="/game" element={<GameDashboard />} />
        </Routes>
      </div>
    </GameProvider>
  );
}

export default App; 