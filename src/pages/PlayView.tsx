import { useState, useEffect } from 'react';
import { Button } from '../components/ui/button.tsx';
import ParticipantStrip from '../components/ParticipantStrip.tsx';
import { useSession } from '../store/SessionContext.tsx';
import CardHand from '../components/CardHand.tsx';
import VoteResults from '../components/VoteResults.tsx';
import type { DelegationLevel } from '../store/types.ts';

const PlayView = (): JSX.Element => {
  const { state, dispatch } = useSession();
  const [selectedLevel, setSelectedLevel] = useState<DelegationLevel | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const participantId = sessionStorage.getItem('participantId') ?? '';
  const { currentRound, scenarios } = state;

  const currentScenarioIndex = currentRound
    ? scenarios.findIndex((s) => s.id === currentRound.scenarioId)
    : -1;
  const currentScenario = currentScenarioIndex >= 0 ? scenarios[currentScenarioIndex] : null;
  const roundNumber = currentScenarioIndex + 1;
  const totalRounds = scenarios.length;

  const isRevealed = currentRound?.status === 'revealed';

  useEffect(() => {
    setSelectedLevel(null);
    setHasSubmitted(false);
  }, [currentRound?.scenarioId]);

  const handleSubmitVote = (): void => {
    if (!selectedLevel || !participantId) return;
    dispatch({
      type: 'submit-vote',
      payload: { participantId, level: selectedLevel },
    });
    setHasSubmitted(true);
  };

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

  if (!currentRound || !currentScenario) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center px-4">
        <p className="text-muted-foreground">Waiting for the facilitator to start…</p>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col items-center px-4 py-8">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">Round {roundNumber} of {totalRounds}</p>
          <h1 className="text-xl font-bold tracking-tight">{currentScenario.description}</h1>
        </div>

        <ParticipantStrip
          participants={state.participants}
          currentRound={currentRound}
          mode={isRevealed ? 'revealed' : 'voting'}
        />

        {isRevealed ? (
          <div className="space-y-4">
            <VoteResults votes={currentRound.votes} participants={state.participants} />
            <p className="text-center text-sm text-muted-foreground">Waiting for facilitator to continue…</p>
          </div>
        ) : hasSubmitted ? (
          <div className="text-center space-y-4 py-8">
            <p className="text-lg font-medium">Vote submitted!</p>
            <p className="text-muted-foreground">Waiting for reveal…</p>
          </div>
        ) : (
          <div className="space-y-4">
            <CardHand onSelect={setSelectedLevel} selectedLevel={selectedLevel} />
            <Button
              className="w-full"
              size="lg"
              disabled={selectedLevel === null}
              onClick={handleSubmitVote}
            >
              Submit vote
            </Button>
          </div>
        )}
      </div>
    </main>
  );
};

export default PlayView;
