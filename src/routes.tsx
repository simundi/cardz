import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.tsx';
import CreateSession from './pages/CreateSession.tsx';
import JoinSession from './pages/JoinSession.tsx';
import SessionPage from './pages/SessionPage.tsx';

export const AppRoutes = (): JSX.Element => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/create" element={<CreateSession />} />
      <Route path="/join/:code" element={<JoinSession />} />
      <Route path="/session/:code" element={<SessionPage />} />
    </Routes>
  );
};
