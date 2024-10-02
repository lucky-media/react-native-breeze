import { useMutation } from '@tanstack/react-query';

import type { Session } from '@/context/session';
import http from '@/utils/http';

export type LoginUser = {
  email: string;
  password: string;
};

export type RegisterUser = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
};

export type ForgotPasswordUser = {
  email: string;
};

export function useLoginMutation() {
  return useMutation({
    mutationFn: (data: LoginUser) =>
      http.post('login', { json: data }).json<Session>(),
  });
}

export function useRegisterMutation() {
  return useMutation({
    mutationFn: (data: RegisterUser) =>
      http.post('register', { json: data }).json<Session>(),
  });
}

export function useForgotPasswordMutation() {
  return useMutation({
    mutationFn: (data: ForgotPasswordUser) =>
      http.post('forgot-password', { json: data }).json<{ status: string }>(),
  });
}

export async function logout({ token }: { token?: string }): Promise<boolean> {
  try {
    await http
      .post('logout', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .json();

    return true;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('logout error', error);

    return false;
  }
}
