import type { ImageProps } from 'react-native';
import { Image, View } from 'react-native';
import tw from 'twrnc';

interface AvatarProps extends ImageProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'rounded';
  isLoading?: boolean;
}

export const Avatar = ({
  source,
  size = 'sm',
  variant = 'default',
  style,
  isLoading = false,
  ...props
}: AvatarProps) => {
  const variants = {
    default: tw`rounded-full`,
    rounded: tw`rounded-lg`,
  };

  const sizes = {
    xs: tw`w-12 h-12`,
    sm: tw`w-16 h-16`,
    md: tw`w-24 h-24`,
    lg: tw`w-36 h-36`,
    xl: tw`w-48 h-48`,
  };

  if (isLoading) {
    return (
      <View style={[variants[variant], sizes[size], tw`bg-gray-200`, style]} />
    );
  }

  return (
    <Image
      style={[variants[variant], sizes[size], style]}
      source={source}
      {...props}
    />
  );
};
