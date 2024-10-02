import * as SecureStore from 'expo-secure-store';
import { useCallback, useEffect, useReducer } from 'react';

type UseStateHook<T> = [[boolean, T | null], (value: T | null) => void];

function useAsyncState<T>(
  initialValue: [boolean, T | null] = [true, null],
): UseStateHook<T> {
  return useReducer(
    (
      _state: [boolean, T | null],
      action: T | null = null,
    ): [boolean, T | null] => [false, action],
    initialValue,
  ) as UseStateHook<T>;
}

export async function setStorageItemAsync(key: string, value: any | null) {
  if (value == null) {
    await SecureStore.deleteItemAsync(key);
  } else {
    const serializedValue = JSON.stringify(value);
    await SecureStore.setItemAsync(key, serializedValue);
  }
}

export async function getStorageItemAsync<T>(key: string): Promise<T | null> {
  const value = await SecureStore.getItemAsync(key);
  return value ? JSON.parse(value) : null;
}

export function useStorageState<T>(key: string): UseStateHook<T> {
  // Public
  const [state, setState] = useAsyncState<T>();

  // Get
  useEffect(() => {
    getStorageItemAsync<T>(key).then((value) => {
      setState(value);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  // Set
  const setValue = useCallback(
    (value: T | null) => {
      setState(value);
      setStorageItemAsync(key, value);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key],
  );

  return [state, setValue];
}
