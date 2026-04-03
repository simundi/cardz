import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSession } from '../store/SessionContext.tsx';
import Lobby from './Lobby.tsx';
import HostView from './HostView.tsx';
import PlayView from './PlayView.tsx';

const SessionPage = (): JSX.Element => {
  const { code: routeCode } = useParams<{ code: string }>();
  const { state, connectToSession } = useSession();

  const sessionCode = state.code || routeCode?.toUpperCase() || '';

  const facilitatorId = sessionStorage.getItem('facilitatorId');
  const isFacilitator = state.participants.some(
    (p) => p.role === 'facilitator' && p.id === facilitatorId,
  );

  const role = isFacilitator ? 'facilitator' : 'participant';

  useEffect(() => {
    if (sessionCode) {
      connectToSession(sessionCode, role);
    }
  }, [sessionCode, role, connectToSession]);

  if (state.status === 'lobby') {
    return <Lobby />;
  }

  if (state.status === 'active') {
    return isFacilitator ? <HostView /> : <PlayView />;
  }

  if (state.status === 'ended') {
    return (
      <main className="flex flex-1 flex-col items-center justify-center px-4">
        <div className="w-full max-w-md text-center space-y-4">
          <h1 className="text-2xl font-bold">Session ended</h1>
          <p className="text-muted-foreground">
            {state.completedRounds.length} round{state.completedRounds.length !== 1 ? 's' : ''} completed.
          </p>
        </div>
      </main>
    );
  }

  return <Lobby />;
};

export default SessionPage;
