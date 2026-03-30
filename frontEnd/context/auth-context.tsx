import React, { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';

import { getStoredJson, setStoredJson } from '@/hooks/use-app-storage';
import { fetchMe, loginUser, registerUser } from '@/services/auth-api';

const SESSION_KEY = 'petshop_session_v2';

type AuthUser = {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
};

type AuthSession = {
  token: string;
  user: AuthUser;
};

type SignUpPayload = {
  name: string;
  email: string;
  password: string;
};

type AuthContextType = {
  user: AuthUser | null;
  token: string | null;
  isReady: boolean;
  isAuthenticated: boolean;
  signUp: (payload: SignUpPayload) => Promise<{ ok: boolean; message?: string }>;
  signIn: (email: string, password: string) => Promise<{ ok: boolean; message?: string }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const bootstrap = async () => {
      const session = await getStoredJson<AuthSession | null>(SESSION_KEY, null);

      if (!session?.token) {
        setIsReady(true);
        return;
      }

      try {
        const me = await fetchMe(session.token);
        setToken(session.token);
        setUser(me.user);
        await setStoredJson<AuthSession>(SESSION_KEY, {
          token: session.token,
          user: me.user,
        });
      } catch {
        await setStoredJson<AuthSession | null>(SESSION_KEY, null);
        setToken(null);
        setUser(null);
      }

      setIsReady(true);
    };

    bootstrap();
  }, []);

  const signUp = async ({ name, email, password }: SignUpPayload) => {
    try {
      await registerUser({ name: name.trim(), email: email.trim(), password });
      const login = await loginUser({ email: email.trim(), password });

      const session: AuthSession = {
        token: login.token,
        user: login.user,
      };

      await setStoredJson<AuthSession>(SESSION_KEY, session);
      setToken(session.token);
      setUser(session.user);

      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        message: error instanceof Error ? error.message : 'Unable to sign up.',
      };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const login = await loginUser({ email: email.trim(), password });

      const session: AuthSession = {
        token: login.token,
        user: login.user,
      };

      await setStoredJson<AuthSession>(SESSION_KEY, session);
      setToken(session.token);
      setUser(session.user);

      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        message: error instanceof Error ? error.message : 'Unable to sign in.',
      };
    }
  };

  const signOut = async () => {
    await setStoredJson<AuthSession | null>(SESSION_KEY, null);
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isReady,
      isAuthenticated: !!user,
      signUp,
      signIn,
      signOut,
    }),
    [isReady, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}
