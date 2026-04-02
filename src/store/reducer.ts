import type { Session, SessionAction, Participant, Scenario } from './types.ts';

export const initialSession: Session = {
  id: '',
  code: '',
  title: '',
  participants: [],
  scenarios: [],
  currentRound: null,
  completedRounds: [],
  status: 'lobby',
};

type ActionPayload<T extends SessionAction['type']> =
  Extract<SessionAction, { type: T }> extends { payload: infer P } ? P : never;

export const sessionReducer = (state: Session, action: SessionAction): Session => {
  switch (action.type) {
    case 'create-session':
      return handleCreateSession(state, action.payload);
    case 'join':
      return handleJoin(state, action.payload);
    case 'participant-left':
      return handleParticipantLeft(state, action.payload);
    case 'add-topic':
      return handleAddTopic(state, action.payload);
    case 'remove-topic':
      return handleRemoveTopic(state, action.payload);
    case 'start-session':
      return handleStartSession(state);
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
  code: payload.code,
  title: payload.title,
  participants: [payload.facilitator],
  scenarios: payload.topics.map((description, i) => ({
    id: `topic-${i}-${Date.now()}`,
    description,
  })),
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

const handleAddTopic = (
  state: Session,
  payload: ActionPayload<'add-topic'>,
): Session => ({
  ...state,
  scenarios: [...state.scenarios, payload.topic],
});

const handleRemoveTopic = (
  state: Session,
  payload: ActionPayload<'remove-topic'>,
): Session => ({
  ...state,
  scenarios: state.scenarios.filter(
    (s: Scenario) => s.id !== payload.topicId,
  ),
});

const handleStartSession = (state: Session): Session => {
  if (state.scenarios.length === 0) return state;
  return {
    ...state,
    status: 'active',
    currentRound: {
      scenarioId: state.scenarios[0].id,
      status: 'voting',
      votes: [],
    },
  };
};
