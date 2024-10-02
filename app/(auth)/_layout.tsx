import { Redirect, Slot } from 'expo-router';

import { useSession } from '@/context/session';

export default function AuthLayout() {
  const { session } = useSession();

  if (session?.token) {
    return <Redirect href="/" />;
  }

  return <Slot />;
}
