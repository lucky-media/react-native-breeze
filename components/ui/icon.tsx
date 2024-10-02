import { Ionicons } from '@expo/vector-icons';

export type IconProps = {
  name: string;
  size?: number;
  color?: string;
};

export const Icon = ({ name, size, color }: IconProps) => {
  return <Ionicons name={name as any} size={size} color={color} />;
};
