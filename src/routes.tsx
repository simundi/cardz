import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.tsx';
import HostView from './pages/HostView.tsx';
import PlayView from './pages/PlayView.tsx';

export const AppRoutes = (): JSX.Element => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/session/:id/host" element={<HostView />} />
      <Route path="/session/:id/play" element={<PlayView />} />
    </Routes>
  );
};
