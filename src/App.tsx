import { BrowserRouter } from 'react-router-dom';
import { SessionProvider } from './store/SessionContext.tsx';
import { AppRoutes } from './routes';

const App = (): JSX.Element => {
  return (
    <BrowserRouter>
      <SessionProvider>
        <AppRoutes />
      </SessionProvider>
    </BrowserRouter>
  );
};

export default App;
