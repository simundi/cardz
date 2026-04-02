import type { SessionAction, Role } from '../store/types.ts';
import type { SyncAdapter } from './SyncAdapter.ts';

export class LocalAdapter implements SyncAdapter {
  private channel: BroadcastChannel | null = null;
  private receiveCallback: ((action: SessionAction) => void) | null = null;

  join(sessionId: string, _role: Role): void {
    this.channel = new BroadcastChannel(`session-${sessionId}`);
    this.channel.onmessage = (event: MessageEvent<SessionAction>) => {
      this.receiveCallback?.(event.data);
    };
  }

  send(action: SessionAction): void {
    this.channel?.postMessage(action);
  }

  onReceive(callback: (action: SessionAction) => void): void {
    this.receiveCallback = callback;
  }

  leave(): void {
    this.channel?.close();
    this.channel = null;
    this.receiveCallback = null;
  }
}
