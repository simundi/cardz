export type DelegationLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export const DELEGATION_LABELS: Record<DelegationLevel, string> = {
  1: 'Tell',
  2: 'Sell',
  3: 'Consult',
  4: 'Agree',
  5: 'Advise',
  6: 'Inquire',
  7: 'Delegate',
};

export type Role = 'facilitator' | 'participant';

export interface Participant {
  id: string;
  name: string;
  role: Role;
}

export interface Vote {
  participantId: string;
  level: DelegationLevel;
}

export interface Scenario {
  id: string;
  description: string;
}

export type RoundStatus = 'voting' | 'revealed';

export interface Round {
  scenarioId: string;
  status: RoundStatus;
  votes: Vote[];
}

export interface Session {
  id: string;
  code: string;
  title: string;
  participants: Participant[];
  scenarios: Scenario[];
  currentRound: Round | null;
  completedRounds: Round[];
  status: 'lobby' | 'active' | 'ended' | 'finished';
}

export type SessionAction =
  | { type: 'create-session'; payload: { sessionId: string; code: string; title: string; facilitator: Participant; topics: string[] } }
  | { type: 'join'; payload: { participant: Participant } }
  | { type: 'participant-left'; payload: { participantId: string } }
  | { type: 'add-topic'; payload: { topic: Scenario } }
  | { type: 'remove-topic'; payload: { topicId: string } }
  | { type: 'start-session' }
  | { type: 'submit-vote'; payload: { participantId: string; level: DelegationLevel } }
  | { type: 'reveal-round' }
  | { type: 'next-round' }
  | { type: 'end-session' }
  | { type: 'request-state' }
  | { type: 'sync-state'; payload: { session: Session } };
