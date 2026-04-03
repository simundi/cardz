/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useReducer, useCallback, useEffect, useRef, type ReactNode } from 'react';
import { sessionReducer, initialSession } from './reducer.ts';
import { LocalAdapter } from '../adapters/LocalAdapter.ts';
import type { Session, SessionAction, Role } from './types.ts';

interface SessionContextValue {
  state: Session;
  dispatch: (action: SessionAction) => void;
  connectToSession: (code: string, role: Role) => void;
  isConnecting: boolean;
}

const SessionContext = createContext<SessionContextValue | null>(null);

const SYNC_TIMEOUT_MS = 3000;

interface SessionProviderProps {
  children: ReactNode;
}

export const SessionProvider = ({ children }: SessionProviderProps): JSX.Element => {
  const [state, rawDispatch] = useReducer(sessionReducer, initialSession);
  const adapterRef = useRef<LocalAdapter | null>(null);
  const stateRef = useRef<Session>(state);
  const connectedCodeRef = useRef<string>('');
  const isConnectingRef = useRef<boolean>(false);
  const [isConnecting, setIsConnecting] = useReducer(
    (_: boolean, next: boolean) => next,
    false,
  );

  stateRef.current = state;

  const connectToSession = useCallback((code: string, role: Role): void => {
    if (connectedCodeRef.current === code) return;

    adapterRef.current?.leave();
    connectedCodeRef.current = code;

    const adapter = new LocalAdapter();
    adapterRef.current = adapter;

    adapter.onReceive((action: SessionAction) => {
      if (action.type === 'request-state' && stateRef.current.code) {
        adapter.send({ type: 'sync-state', payload: { session: stateRef.current } });
        return;
      }
      rawDispatch(action);
      if (action.type === 'sync-state') {
        isConnectingRef.current = false;
        setIsConnecting(false);
      }
    });

    adapter.join(code, role);

    if (role === 'participant') {
      isConnectingRef.current = true;
      setIsConnecting(true);
      adapter.send({ type: 'request-state' });

      setTimeout(() => {
        if (isConnectingRef.current) {
          isConnectingRef.current = false;
          setIsConnecting(false);
        }
      }, SYNC_TIMEOUT_MS);
    }
  }, []);

  const dispatch = useCallback((action: SessionAction): void => {
    rawDispatch(action);
    if (action.type !== 'request-state' && action.type !== 'sync-state') {
      adapterRef.current?.send(action);
    }
  }, []);

  useEffect(() => {
    return () => {
      adapterRef.current?.leave();
      adapterRef.current = null;
      connectedCodeRef.current = '';
    };
  }, []);

  return (
    <SessionContext.Provider value={{ state, dispatch, connectToSession, isConnecting }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = (): SessionContextValue => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};
