import { Check } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarBadge } from './ui/avatar.tsx';
import { cn } from '../lib/utils.ts';
import getInitials from '../lib/getInitials.ts';
import type { Participant, Round, DelegationLevel } from '../store/types.ts';

type StripMode = 'lobby' | 'voting' | 'revealed';

interface ParticipantStripProps {
  participants: Participant[];
  currentRound: Round | null;
  mode: StripMode;
}

interface ParticipantStatus {
  hasVoted: boolean;
  level: DelegationLevel | null;
}

const getParticipantStatus = (
  participantId: string,
  round: Round | null,
): ParticipantStatus => {
  if (!round) return { hasVoted: false, level: null };
  const vote = round.votes.find((v) => v.participantId === participantId);
  return { hasVoted: !!vote, level: vote?.level ?? null };
};

const ParticipantStrip = ({
  participants,
  currentRound,
  mode,
}: ParticipantStripProps): JSX.Element => {
  return (
    <div className="flex flex-wrap justify-center gap-4">
      {participants.map((participant) => {
        const { hasVoted, level } = getParticipantStatus(
          participant.id,
          currentRound,
        );
        const isFacilitator = participant.role === 'facilitator';
        const showVoted = mode === 'voting' && hasVoted;
        const showWaiting = mode === 'voting' && !hasVoted;
        const showLevel = mode === 'revealed' && level !== null;

        return (
          <div
            key={participant.id}
            className="flex w-16 flex-col items-center gap-1"
          >
            <Avatar
              size="lg"
              className={cn(
                (showVoted || showLevel) &&
                  'ring-2 ring-primary ring-offset-2 ring-offset-background',
                showWaiting && 'opacity-50',
              )}
            >
              <AvatarFallback>
                {getInitials(participant.name)}
              </AvatarFallback>
              {showVoted && (
                <AvatarBadge>
                  <Check />
                </AvatarBadge>
              )}
              {showLevel && (
                <AvatarBadge>
                  <span className="text-[9px] font-bold leading-none">
                    {level}
                  </span>
                </AvatarBadge>
              )}
            </Avatar>
            <span className="w-full truncate text-center text-xs">
              {participant.name}
            </span>
            {isFacilitator && (
              <span className="text-[10px] text-muted-foreground">Host</span>
            )}
            {mode === 'voting' && (
              <span
                className={cn(
                  'text-[10px]',
                  hasVoted ? 'text-primary' : 'text-muted-foreground',
                )}
              >
                {hasVoted ? 'Voted' : 'Waiting'}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ParticipantStrip;
