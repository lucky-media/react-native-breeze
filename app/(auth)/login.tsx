import { router } from 'expo-router';
import type { SubmitHandler } from 'react-hook-form';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, Text, View } from 'react-native';
import tw from 'twrnc';

import { TextInput } from '@/components/form/text-input';
import { Button } from '@/components/ui/button';
import type { Session } from '@/context/session';
import { useSession } from '@/context/session';
import { useToast } from '@/context/toast';
import type { LoginUser } from '@/features/auth/useAuthMutations';
import { useLoginMutation } from '@/features/auth/useAuthMutations';
import { handleApiErrors } from '@/utils/helpers';

export default function Login() {
  const userLogin = useLoginMutation();
  const { setSession } = useSession();
  const { showToast } = useToast();

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginUser>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit: SubmitHandler<LoginUser> = async (data: LoginUser) => {
    userLogin.mutate(data, {
      onSuccess: ({ token }: Session) => {
        setSession({ token });

        router.push('/');
      },
      onError: async (error) => {
        await handleApiErrors({ error, setError, showToast });
      },
    });
  };

  return (
    <View style={tw`flex-1 w-full items-center justify-center bg-gray-100`}>
      <View style={tw`px-4 w-full max-w-sm`}>
        <Text style={tw`text-4xl font-bold mb-6 text-gray-900`}>Login</Text>

        <View style={tw`flex flex-col gap-4 mb-4`}>
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

          <Controller
            name="password"
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                autoCapitalize="none"
                placeholder="Password"
                onBlur={onBlur}
                onChangeText={onChange}
                secureTextEntry
                error={
                  errors?.password?.type === 'required' ||
                  errors?.password?.message
                }
                value={value}
              />
            )}
          />
        </View>

        <Button
          text="Login"
          disabled={userLogin.isPending}
          onPress={handleSubmit(onSubmit)}
        />

        <View style={tw`flex flex-col items-center mt-8 gap-2`}>
          <Pressable onPress={() => router.push('/register')}>
            <Text style={tw`text-gray-900 text-xs`}>
              Don&apos;t have an account?{' '}
              <Text style={tw`font-bold`}>Sign up</Text>
            </Text>
          </Pressable>
          <Pressable onPress={() => router.push('/forgot-password')}>
            <Text style={tw`text-gray-900 text-xs`}>Forgot your password?</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
