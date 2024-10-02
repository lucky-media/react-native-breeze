import { useMutation } from '@tanstack/react-query';

import { useSession } from '@/context/session';
import http from '@/utils/http';

export interface UserProfile {
  name: string;
  password?: string | null;
  password_confirmation?: string | null;
}

export function useUpdateUserProfileMutation() {
  const { session } = useSession();

  return useMutation({
    mutationFn: (data: UserProfile) =>
      http
        .post('user', {
          headers: { Authorization: `Bearer ${session?.token}` },
          json: data,
        })
        .json<{ user: any }>(),
  });
}
