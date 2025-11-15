'use client';

import type { ThemeProviderProps } from 'next-themes';
import type { ReactNode } from 'react';

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  return <>{children}</>;
};

export type { ThemeProviderProps };
