import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.tsx';
import CreateSession from './pages/CreateSession.tsx';
import JoinSession from './pages/JoinSession.tsx';
import Lobby from './pages/Lobby.tsx';
import HostView from './pages/HostView.tsx';
import PlayView from './pages/PlayView.tsx';

export const AppRoutes = (): JSX.Element => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/create" element={<CreateSession />} />
      <Route path="/join/:code" element={<JoinSession />} />
      <Route path="/session/:code" element={<Lobby />} />
      <Route path="/session/:id/host" element={<HostView />} />
      <Route path="/session/:id/play" element={<PlayView />} />
    </Routes>
  );
};
