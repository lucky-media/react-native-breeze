import { router } from 'expo-router';
import { useState } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, Text, View } from 'react-native';
import tw from 'twrnc';

import { TextInput } from '@/components/form/text-input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/context/toast';
import type { ForgotPasswordUser } from '@/features/auth/useAuthMutations';
import { useForgotPasswordMutation } from '@/features/auth/useAuthMutations';
import { handleApiErrors } from '@/utils/helpers';

export default function Login() {
  const [status, setStatus] = useState<string>('');
  const { showToast } = useToast();
  const forgotPassword = useForgotPasswordMutation();

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ForgotPasswordUser>({
    defaultValues: {
      email: '',
    },
  });

  const onSubmit: SubmitHandler<ForgotPasswordUser> = async (
    data: ForgotPasswordUser,
  ) => {
    forgotPassword.mutate(data, {
      onSuccess: ({ status: statusMessage }: { status: string }) => {
        setStatus(statusMessage);
      },
      onError: async (error) => {
        await handleApiErrors({ error, setError, showToast });
      },
    });
  };

  return (
    <View style={tw`flex-1 w-full items-center justify-center bg-gray-100`}>
      <View style={tw`px-4 w-full max-w-sm`}>
        <Text style={tw`text-4xl font-bold mb-2 text-gray-900`}>
          Forgot Password ?
        </Text>

        <Text style={tw`text-xs mb-6 text-gray-900`}>
          Forgot your password? No problem. Just let us know your email address
          and we will email you a password reset link that will allow you to
          choose a new one.
        </Text>

        <View style={tw`flex flex-col mb-4`}>
          <Controller
            name="email"
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                autoCapitalize="none"
                placeholder="Email Address"
                onBlur={onBlur}
                onChangeText={onChange}
                keyboardType="email-address"
                value={value}
                error={
                  errors?.email?.type === 'required' || errors?.email?.message
                }
              />
            )}
          />
        </View>

        <Button
          text="Email Password Reset Link"
          disabled={forgotPassword.isPending}
          onPress={handleSubmit(onSubmit)}
        />

        {status !== '' && (
          <View style={tw`flex flex-col mt-6`}>
            <Text style={tw`text-sm text-center text-green-600`}>{status}</Text>
          </View>
        )}

        <Pressable onPress={() => router.push('/login')}>
          <Text style={tw`text-center text-gray-600 font-bold mt-6`}>
            Go Back
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
