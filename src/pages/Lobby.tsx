import { useState } from 'react';
import { Button } from '../components/ui/button.tsx';
import { Input } from '../components/ui/input.tsx';
import { useSession } from '../store/SessionContext.tsx';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard.ts';

const Lobby = (): JSX.Element => {
  const { state, dispatch } = useSession();
  const { copied, copyToClipboard, fallbackUrl } = useCopyToClipboard();
  const [topicInput, setTopicInput] = useState('');

  const joinUrl = `${window.location.origin}/join/${state.code}`;

  const handleCopyLink = (): void => {
    copyToClipboard(joinUrl);
  };

  const handleAddTopic = (): void => {
    const trimmed = topicInput.trim();
    if (!trimmed || trimmed.length > 120) return;
    dispatch({
      type: 'add-topic',
      payload: {
        topic: {
          id: `topic-${Date.now()}`,
          description: trimmed,
        },
      },
    });
    setTopicInput('');
  };

  const handleTopicKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTopic();
    }
  };

  const handleRemoveTopic = (topicId: string): void => {
    dispatch({ type: 'remove-topic', payload: { topicId } });
  };

  const handleStartSession = (): void => {
    dispatch({ type: 'start-session' });
  };

  const participants = state.participants.filter((p) => p.role === 'participant');
  const hasTopics = state.scenarios.length > 0;

  return (
    <main className="flex flex-1 flex-col items-center px-4 py-8">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">{state.title}</h1>
          <p className="text-5xl font-mono font-bold tracking-widest">{state.code}</p>
          <div className="flex justify-center gap-2 items-center">
            <Button variant="outline" size="sm" onClick={handleCopyLink}>
              {copied ? 'Link copied!' : 'Copy link'}
            </Button>
          </div>
          {fallbackUrl && (
            <input
              type="text"
              readOnly
              value={fallbackUrl}
              className="w-full mt-2 px-3 py-2 text-sm border rounded-md bg-muted text-center select-all"
              onFocus={(e) => e.target.select()}
            />
          )}
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Participants</h2>
          {participants.length === 0 ? (
            <p className="text-muted-foreground text-sm">Waiting for participants to join…</p>
          ) : (
            <ul className="space-y-1">
              {participants.map((p) => (
                <li key={p.id} className="rounded-md border px-3 py-2 text-sm">
                  {p.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Topics</h2>
          <div className="flex gap-2">
            <Input
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
              onKeyDown={handleTopicKeyDown}
              placeholder="Add a topic"
              maxLength={120}
              className="flex-1"
            />
            <Button type="button" variant="outline" onClick={handleAddTopic}>
              Add topic
            </Button>
          </div>
          {state.scenarios.length > 0 && (
            <ol className="space-y-1">
              {state.scenarios.map((scenario, index) => (
                <li key={scenario.id} className="flex items-center justify-between rounded-md border px-3 py-2 text-sm">
                  <span className="mr-2">{index + 1}. {scenario.description}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTopic(scenario.id)}
                    className="text-muted-foreground hover:text-destructive shrink-0"
                    aria-label={`Remove topic: ${scenario.description}`}
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ol>
          )}
        </div>

        <Button
          className="w-full"
          size="lg"
          disabled={!hasTopics}
          onClick={handleStartSession}
        >
          Start session
        </Button>
      </div>
    </main>
  );
};

export default Lobby;
