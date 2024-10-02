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
import type { RegisterUser } from '@/features/auth/useAuthMutations';
import { useRegisterMutation } from '@/features/auth/useAuthMutations';
import { handleApiErrors } from '@/utils/helpers';

export default function Register() {
  const { setSession } = useSession();
  const userRegister = useRegisterMutation();
  const { showToast } = useToast();

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterUser>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
    },
  });

  const onSubmit: SubmitHandler<RegisterUser> = async (data: RegisterUser) => {
    userRegister.mutate(data, {
      onSuccess: ({ token }: Session) => {
        setSession({ token });
      },
      onError: async (error) => {
        await handleApiErrors({ error, setError, showToast });
      },
    });
  };

  return (
    <View style={tw`flex-1 w-full items-center justify-center bg-gray-100`}>
      <View style={tw`px-4 w-full max-w-sm`}>
        <Text style={tw`text-4xl font-bold mb-6 text-gray-900`}>Register</Text>

        <View style={tw`flex flex-col gap-4 mb-4`}>
          <Controller
            name="name"
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                autoCapitalize="none"
                placeholder="Name"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={
                  errors?.name?.type === 'required' || errors?.name?.message
                }
              />
            )}
          />

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

          <Controller
            name="password_confirmation"
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                autoCapitalize="none"
                placeholder="Confirm Password"
                onBlur={onBlur}
                onChangeText={onChange}
                secureTextEntry
                error={
                  errors?.password_confirmation?.type === 'required' ||
                  errors?.password_confirmation?.message
                }
                value={value}
              />
            )}
          />
        </View>

        <Button
          text="Register"
          disabled={userRegister.isPending}
          onPress={handleSubmit(onSubmit)}
        />

        <Pressable onPress={() => router.push('/login')}>
          <Text style={tw`text-gray-900 text-xs text-center mt-8`}>
            Already have an account? <Text style={tw`font-bold`}>Login</Text>
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
