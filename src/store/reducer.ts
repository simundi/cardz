import type { Session, SessionAction, Participant, Scenario, DelegationLevel } from './types.ts';

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
    case 'submit-vote':
      return handleSubmitVote(state, action.payload);
    case 'reveal-round':
      return handleRevealRound(state);
    case 'next-round':
      return handleNextRound(state);
    case 'end-session':
      return handleEndSession(state);
    case 'sync-state':
      return action.payload.session;
    case 'request-state':
      return state;
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

const handleSubmitVote = (
  state: Session,
  payload: { participantId: string; level: DelegationLevel },
): Session => {
  if (!state.currentRound || state.currentRound.status !== 'voting') return state;
  const existingIndex = state.currentRound.votes.findIndex(
    (v) => v.participantId === payload.participantId,
  );
  const newVotes = existingIndex >= 0
    ? state.currentRound.votes.map((v, i) =>
        i === existingIndex ? { participantId: payload.participantId, level: payload.level } : v,
      )
    : [...state.currentRound.votes, { participantId: payload.participantId, level: payload.level }];
  return {
    ...state,
    currentRound: { ...state.currentRound, votes: newVotes },
  };
};

const handleRevealRound = (state: Session): Session => {
  if (!state.currentRound || state.currentRound.status !== 'voting') return state;
  return {
    ...state,
    currentRound: { ...state.currentRound, status: 'revealed' },
  };
};

const handleNextRound = (state: Session): Session => {
  if (!state.currentRound || state.currentRound.status !== 'revealed') return state;
  const currentScenarioIndex = state.scenarios.findIndex(
    (s) => s.id === state.currentRound!.scenarioId,
  );
  const nextScenario = state.scenarios[currentScenarioIndex + 1];
  if (!nextScenario) return state;
  return {
    ...state,
    completedRounds: [...state.completedRounds, state.currentRound],
    currentRound: {
      scenarioId: nextScenario.id,
      status: 'voting',
      votes: [],
    },
  };
};

const handleEndSession = (state: Session): Session => {
  const completedRounds = state.currentRound
    ? [...state.completedRounds, state.currentRound]
    : state.completedRounds;
  return {
    ...state,
    status: 'ended',
    completedRounds,
    currentRound: null,
  };
};

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
