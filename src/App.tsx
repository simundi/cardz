import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes';

const App = (): JSX.Element => {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;
