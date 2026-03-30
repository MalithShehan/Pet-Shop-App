import React, { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';

import { getStoredJson, setStoredJson } from '@/hooks/use-app-storage';

const USERS_KEY = 'petshop_users_v1';
const SESSION_KEY = 'petshop_session_v1';

type AuthUser = {
  name: string;
  email: string;
};

type StoredUser = AuthUser & {
  password: string;
};

type SignUpPayload = {
  name: string;
  email: string;
  password: string;
};

type AuthContextType = {
  user: AuthUser | null;
  isReady: boolean;
  isAuthenticated: boolean;
  signUp: (payload: SignUpPayload) => Promise<{ ok: boolean; message?: string }>;
  signIn: (email: string, password: string) => Promise<{ ok: boolean; message?: string }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const bootstrap = async () => {
      const session = await getStoredJson<AuthUser | null>(SESSION_KEY, null);
      setUser(session);
      setIsReady(true);
    };

    bootstrap();
  }, []);

  const signUp = async ({ name, email, password }: SignUpPayload) => {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedName = name.trim();

    const users = await getStoredJson<StoredUser[]>(USERS_KEY, []);
    const existing = users.find((item) => item.email === normalizedEmail);

    if (existing) {
      return { ok: false, message: 'Email is already registered.' };
    }

    const nextUser: StoredUser = {
      name: normalizedName,
      email: normalizedEmail,
      password,
    };

    const sessionUser: AuthUser = {
      name: normalizedName,
      email: normalizedEmail,
    };

    await setStoredJson(USERS_KEY, [...users, nextUser]);
    await setStoredJson(SESSION_KEY, sessionUser);
    setUser(sessionUser);

    return { ok: true };
  };

  const signIn = async (email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const users = await getStoredJson<StoredUser[]>(USERS_KEY, []);
    const matched = users.find((item) => item.email === normalizedEmail && item.password === password);

    if (!matched) {
      return { ok: false, message: 'Invalid email or password.' };
    }

    const sessionUser: AuthUser = {
      name: matched.name,
      email: matched.email,
    };

    await setStoredJson(SESSION_KEY, sessionUser);
    setUser(sessionUser);

    return { ok: true };
  };

  const signOut = async () => {
    await setStoredJson<AuthUser | null>(SESSION_KEY, null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      isReady,
      isAuthenticated: !!user,
      signUp,
      signIn,
      signOut,
    }),
    [isReady, user]
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
