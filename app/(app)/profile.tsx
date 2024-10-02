import { useQueryClient } from '@tanstack/react-query';
import type { SubmitHandler } from 'react-hook-form';
import { Controller, useForm } from 'react-hook-form';
import { Text, View } from 'react-native';
import tw from 'twrnc';

import { TextInput } from '@/components/form/text-input';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useToast } from '@/context/toast';
import type { UserProfile } from '@/features/profile/useUserMutation';
import { useUpdateUserProfileMutation } from '@/features/profile/useUserMutation';
import { useUserQuery } from '@/features/profile/useUserQuery';
import { handleApiErrors } from '@/utils/helpers';

export default function Profile() {
  const { data: user } = useUserQuery();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<UserProfile>({
    defaultValues: {
      name: user?.name,
      password: null,
      password_confirmation: null,
    },
  });

  const userUpdate = useUpdateUserProfileMutation();

  const onSubmit: SubmitHandler<UserProfile> = async (data: UserProfile) => {
    userUpdate.mutate(data, {
      onError: async (error) => {
        await handleApiErrors({ error, setError, showToast });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['user'] });
        showToast({
          type: 'success',
          message: 'User updated successfully',
          duration: 1000,
        });
      },
    });
  };

  return (
    <View style={tw`flex-1 p-4`}>
      <View style={tw`items-center mb-6`}>
        <Avatar
          source={{
            uri: `https://ui-avatars.com/api/?name=${user?.name.replace(
              ' ',
              '+',
            )}&size=128"`,
          }}
          size="lg"
        />
      </View>

      <View style={tw`mb-4`}>
        <Text style={tw`text-gray-600 mb-2`}>Name</Text>
        <Controller
          name="name"
          control={control}
          rules={{ required: 'Name is required' }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Enter your name"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.name?.message}
            />
          )}
        />
      </View>

      <View style={tw`mb-4`}>
        <Text style={tw`text-gray-600 mb-2`}>Password</Text>
        <Controller
          name="password"
          control={control}
          rules={{
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters',
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Enter new password"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value || ''}
              secureTextEntry
              error={errors.password?.message}
            />
          )}
        />
      </View>

      <View style={tw`mb-4`}>
        <Controller
          name="password_confirmation"
          control={control}
          rules={{
            validate: (value) =>
              /* eslint no-underscore-dangle: 0 */
              value === control._formValues.password ||
              'Passwords do not match',
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Confirm new password"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value || ''}
              secureTextEntry
              error={errors.password_confirmation?.message}
            />
          )}
        />
      </View>

      <Button disabled={userUpdate.isPending} onPress={handleSubmit(onSubmit)}>
        Save Changes
      </Button>
    </View>
  );
}
