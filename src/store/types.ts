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
  participants: Participant[];
  scenarios: Scenario[];
  currentRound: Round | null;
  completedRounds: Round[];
  status: 'lobby' | 'active' | 'ended';
}

export type SessionAction =
  | { type: 'create-session'; payload: { sessionId: string; facilitator: Participant } }
  | { type: 'join'; payload: { participant: Participant } }
  | { type: 'participant-left'; payload: { participantId: string } };
