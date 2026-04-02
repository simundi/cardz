import { useEffect, useRef, useCallback, type Dispatch } from 'react';
import type { SyncAdapter } from '../adapters/SyncAdapter.ts';
import type { SessionAction, Role } from './types.ts';

interface UseSyncOptions {
  adapter: SyncAdapter;
  sessionId: string;
  role: Role;
  dispatch: Dispatch<SessionAction>;
}

export const useSync = ({ adapter, sessionId, role, dispatch }: UseSyncOptions): {
  sendAction: (action: SessionAction) => void;
} => {
  const adapterRef = useRef(adapter);
  adapterRef.current = adapter;

  useEffect(() => {
    const currentAdapter = adapterRef.current;
    currentAdapter.onReceive((action: SessionAction) => {
      dispatch(action);
    });
    currentAdapter.join(sessionId, role);

    return () => {
      currentAdapter.leave();
    };
  }, [sessionId, role, dispatch]);

  const sendAction = useCallback((action: SessionAction): void => {
    adapterRef.current.send(action);
  }, []);

  return { sendAction };
};
