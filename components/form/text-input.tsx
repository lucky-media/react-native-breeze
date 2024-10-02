import type { TextInputProps } from 'react-native';
import { Text, TextInput as DefaultTextInput, View } from 'react-native';
import tw from 'twrnc';

interface InputProps extends TextInputProps {
  error?: string | boolean;
}

export const TextInput = ({
  placeholderTextColor,
  error,
  ...props
}: InputProps) => {
  return (
    <View
      style={[tw`flex flex-col`, error ? tw`gap-1` : undefined, props.style]}
    >
      <DefaultTextInput
        {...props}
        style={[
          tw`w-full bg-neutral-100 border rounded-md h-12 px-4 text-neutral-950`,
          error ? tw`border-red-500` : tw`border-black/20`,
          props.style,
        ]}
        placeholderTextColor={
          placeholderTextColor || tw.color('text-neutral-500')
        }
      />
      {error && (
        <Text style={[tw`text-xs font-bold leading-none text-red-500 mt-1`]}>
          {typeof error === 'string'
            ? error
            : `${props.placeholder} is required`}
        </Text>
      )}
    </View>
  );
};
