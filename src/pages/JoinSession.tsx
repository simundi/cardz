import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/button.tsx';
import { Input } from '../components/ui/input.tsx';
import { Label } from '../components/ui/label.tsx';
import { useSession } from '../store/SessionContext.tsx';
import { generateParticipantName } from '../lib/generateParticipantName.ts';

const JoinSession = (): JSX.Element => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const { state, dispatch, connectToSession, isConnecting } = useSession();
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const normalizedCode = code?.toUpperCase() ?? '';

  useEffect(() => {
    connectToSession(normalizedCode, 'participant');
  }, [normalizedCode, connectToSession]);

  const sessionExists = state.code === normalizedCode;
  const sessionJoinable = sessionExists && state.status !== 'finished' && state.status !== 'ended';

  const isFacilitator = sessionExists && state.participants.some(
    (p) => p.role === 'facilitator' && sessionStorage.getItem('facilitatorId') === p.id,
  );

  if (isFacilitator) {
    void navigate(`/session/${normalizedCode}`, { replace: true });
  }

  if (isConnecting) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center px-4">
        <p className="text-muted-foreground">Connecting to session…</p>
      </main>
    );
  }

  if (!sessionJoinable) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center px-4">
        <div className="w-full max-w-md text-center space-y-4">
          <h1 className="text-2xl font-bold">This session is no longer available.</h1>
          <Link to="/" className="text-primary underline">
            Back to home
          </Link>
        </div>
      </main>
    );
  }

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Please enter your name');
      return;
    }

    const uniqueName = generateParticipantName(trimmedName, state.participants);

    dispatch({
      type: 'join',
      payload: {
        participant: {
          id: crypto.randomUUID(),
          name: uniqueName,
          role: 'participant',
        },
      },
    });

    void navigate(`/session/${normalizedCode}`);
  };

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">{state.title}</h1>
          <p className="text-muted-foreground">Enter your name to join the session.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2 text-left">
            <Label htmlFor="participant-name">Your name</Label>
            <Input
              id="participant-name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              placeholder="Enter your name"
              maxLength={40}
              autoFocus
            />
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </div>
          <Button type="submit" className="w-full" size="lg">
            Join session
          </Button>
        </form>
      </div>
    </main>
  );
};

export default JoinSession;
