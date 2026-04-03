import { DELEGATION_LABELS, type DelegationLevel, type Vote, type Participant } from '../store/types.ts';

interface VoteResultsProps {
  votes: Vote[];
  participants: Participant[];
}

const VoteResults = ({ votes, participants }: VoteResultsProps): JSX.Element => {
  const participantMap = new Map(participants.map((p) => [p.id, p.name]));

  const levels = votes.map((v) => v.level);
  const min = levels.length > 0 ? Math.min(...levels) : 0;
  const max = levels.length > 0 ? Math.max(...levels) : 0;

  const distribution = new Map<DelegationLevel, number>();
  for (const vote of votes) {
    distribution.set(vote.level, (distribution.get(vote.level) ?? 0) + 1);
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-muted-foreground">Votes</h3>
        <ul className="space-y-1">
          {votes.map((vote) => (
            <li key={vote.participantId} className="flex items-center justify-between rounded-md border px-3 py-2 text-sm">
              <span>{participantMap.get(vote.participantId) ?? 'Unknown'}</span>
              <span className="font-semibold">
                {vote.level} — {DELEGATION_LABELS[vote.level]}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {votes.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground">Distribution</h3>
          <div className="flex items-center gap-4 text-sm">
            <span>Min: <strong>{min} ({DELEGATION_LABELS[min as DelegationLevel]})</strong></span>
            <span>Max: <strong>{max} ({DELEGATION_LABELS[max as DelegationLevel]})</strong></span>
            <span>Spread: <strong>{max - min}</strong></span>
          </div>
          <div className="flex gap-1">
            {([1, 2, 3, 4, 5, 6, 7] as DelegationLevel[]).map((level) => {
              const count = distribution.get(level) ?? 0;
              return (
                <div key={level} className="flex-1 text-center">
                  <div className="text-xs text-muted-foreground mb-1">{level}</div>
                  <div className="bg-muted rounded-md flex items-end justify-center h-12">
                    {count > 0 && (
                      <div
                        className="bg-primary rounded-md w-full"
                        style={{ height: `${(count / votes.length) * 100}%` }}
                      />
                    )}
                  </div>
                  <div className="text-xs font-medium mt-1">{count}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default VoteResults;
