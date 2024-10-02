/* eslint-disable react/jsx-no-useless-fragment */
import { createContext, useContext, useState } from 'react';
import type { PressableProps, TextProps, ViewStyle } from 'react-native';
import { Pressable, Text, View } from 'react-native';
import tw from 'twrnc';

import type { IconProps } from '@/components/ui/icon';
import { Icon } from '@/components/ui/icon';

export type ButtonVariant =
  | 'default'
  | 'success'
  | 'destructive'
  | 'info'
  | 'warning'
  | 'outline';

interface ButtonProps extends PressableProps {
  variant?: ButtonVariant;
  text?: string;
  icon?: IconProps;
  selected?: boolean;
}

const VariantContext = createContext('default');

export const ButtonText = ({ style, children }: TextProps) => {
  const variant = useContext(VariantContext);

  const variants = {
    default: tw`text-neutral-50 dark:text-neutral-900`,
    success: tw`text-green-50`,
    destructive: tw`text-red-50`,
    warning: tw`text-orange-50`,
    info: tw`text-blue-50`,
    outline: tw`text-gray-800`,
  };

  return (
    <Text
      style={[tw`font-bold`, variants[variant as keyof typeof variants], style]}
    >
      {children}
    </Text>
  );
};

export const ButtonIcon = ({ name, color, size }: IconProps) => {
  const variant = useContext(VariantContext);

  const variants = {
    default: tw.color('text-neutral-50'),
    destructive: tw.color('text-red-50'),
    success: tw.color('text-green-50'),
    warning: tw.color('text-orange-50'),
    info: tw.color('text-blue-50'),
    outline: tw.color('text-gray-800'),
  };

  return (
    <Icon
      name={name}
      size={size || 18}
      color={color || variants[variant as keyof typeof variants]}
    />
  );
};

/**
 * React Native button component built with Tailwind CSS
 */
export const Button = ({
  text,
  icon,
  variant = 'default',
  selected,
  style,
  children,
  ...props
}: ButtonProps) => {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  const variants = {
    default: {
      bg: tw`bg-neutral-800`,
      hover: tw`bg-neutral-950`,
    },
    success: {
      bg: tw`bg-green-600`,
      hover: tw`bg-green-700`,
    },
    destructive: {
      bg: tw`bg-red-600`,
      hover: tw`bg-red-700`,
    },
    warning: {
      bg: tw`bg-orange-600`,
      hover: tw`bg-orange-700`,
    },
    info: {
      bg: tw`bg-blue-600`,
      hover: tw`bg-blue-700`,
    },
    outline: {
      bg: tw`bg-gray-100`,
      hover: tw`bg-gray-200`,
    },
  };

  const renderContent = () => {
    if (icon && text) {
      return (
        <View style={tw`flex flex-row items-center gap-2`}>
          <ButtonIcon {...icon} />
          <ButtonText>{text}</ButtonText>
        </View>
      );
    }

    if (icon) {
      return (
        <View style={tw`flex flex-row items-center`}>
          {icon ? <ButtonIcon {...icon} /> : null}
          <>{children}</>
        </View>
      );
    }

    if (text) {
      return <ButtonText>{text}</ButtonText>;
    }

    if (typeof children === 'string') {
      return <ButtonText>{children}</ButtonText>;
    }

    return <>{children}</>;
  };

  return (
    <Pressable
      {...props}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={[
        tw`h-10 px-4 flex-row gap-2 items-center justify-center rounded-md`,
        variants[variant].bg,
        hovered || pressed || selected ? variants[variant].hover : null,
        props?.disabled ? tw`opacity-50` : null,
        style as ViewStyle,
      ]}
    >
      <VariantContext.Provider value={variant}>
        {renderContent()}
      </VariantContext.Provider>
    </Pressable>
  );
};
