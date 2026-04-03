import { useState, useEffect } from 'react';
import { Button } from '../components/ui/button.tsx';
import { useSession } from '../store/SessionContext.tsx';
import CardHand from '../components/CardHand.tsx';
import VoteResults from '../components/VoteResults.tsx';
import type { DelegationLevel } from '../store/types.ts';

const HostView = (): JSX.Element => {
  const { state, dispatch } = useSession();
  const [selectedLevel, setSelectedLevel] = useState<DelegationLevel | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const facilitatorId = sessionStorage.getItem('facilitatorId') ?? '';
  const { currentRound, scenarios, participants } = state;

  const currentScenarioIndex = currentRound
    ? scenarios.findIndex((s) => s.id === currentRound.scenarioId)
    : -1;
  const currentScenario = currentScenarioIndex >= 0 ? scenarios[currentScenarioIndex] : null;
  const roundNumber = currentScenarioIndex + 1;
  const totalRounds = scenarios.length;
  const isLastTopic = currentScenarioIndex === scenarios.length - 1;

  const isVoting = currentRound?.status === 'voting';
  const isRevealed = currentRound?.status === 'revealed';

  const voteCount = currentRound?.votes.length ?? 0;
  const totalParticipants = participants.length;

  useEffect(() => {
    setSelectedLevel(null);
    setHasSubmitted(false);
  }, [currentRound?.scenarioId]);

  const handleSubmitVote = (): void => {
    if (!selectedLevel || !facilitatorId) return;
    dispatch({
      type: 'submit-vote',
      payload: { participantId: facilitatorId, level: selectedLevel },
    });
    setHasSubmitted(true);
  };

  const handleReveal = (): void => {
    dispatch({ type: 'reveal-round' });
  };

  const handleNextRound = (): void => {
    dispatch({ type: 'next-round' });
  };

  const handleEndSession = (): void => {
    dispatch({ type: 'end-session' });
  };

  if (!currentRound || !currentScenario) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center px-4">
        <p className="text-muted-foreground">No active round.</p>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col items-center px-4 py-8">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">Round {roundNumber} of {totalRounds}</p>
          <h1 className="text-xl font-bold tracking-tight">{currentScenario.description}</h1>
          {isVoting && (
            <p className="text-sm text-muted-foreground">
              {voteCount} / {totalParticipants} votes submitted
            </p>
          )}
        </div>

        {isVoting && !hasSubmitted && (
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

        {isVoting && hasSubmitted && (
          <div className="text-center space-y-2 py-4">
            <p className="text-sm text-muted-foreground">Your vote is in. Reveal when ready.</p>
          </div>
        )}

        {isRevealed && (
          <VoteResults votes={currentRound.votes} participants={participants} />
        )}

        <div className="flex gap-2">
          {isVoting && (
            <Button className="flex-1" size="lg" onClick={handleReveal}>
              Reveal votes
            </Button>
          )}

          {isRevealed && !isLastTopic && (
            <Button className="flex-1" size="lg" onClick={handleNextRound}>
              Next topic
            </Button>
          )}

          {isRevealed && isLastTopic && (
            <Button className="flex-1" size="lg" onClick={handleEndSession}>
              End session
            </Button>
          )}

          {isRevealed && !isLastTopic && (
            <Button variant="outline" size="lg" onClick={handleEndSession}>
              End session
            </Button>
          )}
        </div>
      </div>
    </main>
  );
};

export default HostView;
