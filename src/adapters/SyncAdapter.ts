import type { SessionAction, Role } from '../store/types.ts';

export interface SyncAdapter {
  join(sessionId: string, role: Role): void;
  send(action: SessionAction): void;
  onReceive(callback: (action: SessionAction) => void): void;
  leave(): void;
}
