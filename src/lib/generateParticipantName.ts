import type { Participant } from '../store/types.ts';

export const generateParticipantName = (
  desiredName: string,
  existingParticipants: Participant[],
): string => {
  const existingNames = new Set(existingParticipants.map((p) => p.name));
  if (!existingNames.has(desiredName)) return desiredName;

  let suffix = 2;
  while (existingNames.has(`${desiredName} ${suffix}`)) {
    suffix++;
  }
  return `${desiredName} ${suffix}`;
};
