import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button.tsx';
import { Input } from '../components/ui/input.tsx';

const extractCodeFromInput = (input: string): string => {
  const trimmed = input.trim();
  const urlMatch = trimmed.match(/\/join\/([A-Za-z0-9]+)\s*$/);
  if (urlMatch) return urlMatch[1].toUpperCase();
  return trimmed.toUpperCase();
};

const Home = (): JSX.Element => {
  const navigate = useNavigate();
  const [showJoinInput, setShowJoinInput] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [joinError, setJoinError] = useState('');

  const handleJoinSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    const code = extractCodeFromInput(joinCode);
    if (!code) return;
    setJoinError('');
    void navigate(`/join/${code}`);
  };

  const handleCreateClick = (): void => {
    void navigate('/create');
  };

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <h1 className="text-3xl font-bold tracking-tight">Delegation Poker</h1>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          A collaborative game to align on decision-making authority.
          Choose delegation levels for real scenarios and reveal together
          to spark meaningful team discussions.
        </p>

        <Button
          onClick={handleCreateClick}
          className="mt-10 w-full"
          size="lg"
        >
          Create session
        </Button>

        {!showJoinInput ? (
          <Button
            onClick={() => setShowJoinInput(true)}
            variant="outline"
            className="mt-4 w-full"
            size="lg"
          >
            Join with a code
          </Button>
        ) : (
          <form onSubmit={handleJoinSubmit} className="mt-4">
            <div className="flex gap-2">
              <Input
                value={joinCode}
                onChange={(e) => {
                  setJoinCode(e.target.value);
                  setJoinError('');
                }}
                placeholder="Enter room code"
                className="flex-1 uppercase"
                autoFocus
              />
              <Button type="submit" variant="outline">
                Join
              </Button>
            </div>
            {joinError && (
              <p className="mt-2 text-sm text-destructive">{joinError}</p>
            )}
          </form>
        )}
      </div>
    </main>
  );
};

export default Home;
