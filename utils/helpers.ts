import type { FieldValues, Path, UseFormSetError } from 'react-hook-form';

import type { ToastProps } from '@/context/toast';

export async function handleApiErrors<T extends FieldValues>({
  error,
  setError,
  showToast,
}: {
  error: any;
  setError: UseFormSetError<T>;
  showToast: (props: ToastProps) => void;
}): Promise<void> {
  if (error.name === 'HTTPError' && error.response.status === 422) {
    const errors = await (error as any).response.json();

    Object.keys(errors).forEach((field) => {
      // Join error messages on one single string
      const errorMessage = Array.isArray(errors[field])
        ? errors[field].join(' ')
        : errors[field];

      setError(field as Path<T>, {
        type: 'manual',
        message: errorMessage as string,
      });
    });
  } else {
    // Uncomment to see the full error object
    // console.log(JSON.stringify(error, null, 2));
    showToast({
      type: 'error',
      message: 'Something went wrong',
    });
  }
}
