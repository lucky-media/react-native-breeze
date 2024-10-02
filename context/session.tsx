import {
  createContext,
  type PropsWithChildren,
  useContext,
  useMemo,
} from 'react';

import { useStorageState } from '@/hooks/useStorageState';

export type Session = {
  token: string;
};

const AuthContext = createContext<{
  setSession: (session: Session | null) => void;
  session?: Session | null;
  isLoading: boolean;
}>({
  setSession: () => {},
  session: null,
  isLoading: false,
});

export function useSession() {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error('useSession must be wrapped in a <SessionProvider />');
  }

  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [[isLoading, session], setSession] =
    useStorageState<Session>('session');

  const value = useMemo(
    () => ({
      setSession,
      session,
      isLoading,
    }),
    [setSession, session, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
