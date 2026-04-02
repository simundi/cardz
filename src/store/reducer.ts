import type { Session, SessionAction, Participant } from './types.ts';

export const initialSession: Session = {
  id: '',
  participants: [],
  scenarios: [],
  currentRound: null,
  completedRounds: [],
  status: 'lobby',
};

type ActionPayload<T extends SessionAction['type']> =
  Extract<SessionAction, { type: T }>['payload'];

export const sessionReducer = (state: Session, action: SessionAction): Session => {
  switch (action.type) {
    case 'create-session':
      return handleCreateSession(state, action.payload);
    case 'join':
      return handleJoin(state, action.payload);
    case 'participant-left':
      return handleParticipantLeft(state, action.payload);
    default:
      return state;
  }
};

const handleCreateSession = (
  state: Session,
  payload: ActionPayload<'create-session'>,
): Session => ({
  ...state,
  id: payload.sessionId,
  participants: [payload.facilitator],
  status: 'lobby',
});

const handleJoin = (
  state: Session,
  payload: ActionPayload<'join'>,
): Session => ({
  ...state,
  participants: [...state.participants, payload.participant],
});

const handleParticipantLeft = (
  state: Session,
  payload: ActionPayload<'participant-left'>,
): Session => ({
  ...state,
  participants: state.participants.filter(
    (p: Participant) => p.id !== payload.participantId,
  ),
});
