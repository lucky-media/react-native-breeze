import { Ionicons } from '@expo/vector-icons';
import type { StyleProp, ViewStyle } from 'react-native';
import { Pressable } from 'react-native';
import tw from 'twrnc';

type CheckboxProps = {
  onChange: (newValue: boolean) => void;
  checked: boolean;
  style?: StyleProp<ViewStyle>;
};

export const Checkbox = ({ onChange, checked, style }: CheckboxProps) => {
  const handleToggle = () => {
    onChange(!checked);
  };

  return (
    <Pressable
      style={[
        tw`flex items-center justify-center w-8 h-8 bg-neutral-50 rounded-md border border-neutral-300`,
        style,
      ]}
      onPress={handleToggle}
      role="checkbox"
    >
      {checked ? (
        <Ionicons name="checkmark" style={tw`text-neutral-950 text-2xl`} />
      ) : null}
    </Pressable>
  );
};
