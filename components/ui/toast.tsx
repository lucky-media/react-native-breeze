import React from 'react';
import { Animated, Text, View } from 'react-native';
import tw from 'twrnc';

import type { ToastProps } from '@/context/toast';
import { useToast } from '@/context/toast';

import { Icon } from './icon';

const Toast = ({ type = 'success', message, duration = 350 }: ToastProps) => {
  const bottom = React.useRef(new Animated.Value(-120)).current;

  const { hideToast } = useToast();

  const variants = {
    success: {
      title: 'Success',
      icon: 'checkmark-circle',
      style: 'green',
    },
    error: {
      title: 'Error',
      icon: 'close-circle',
      style: 'red',
    },
  };

  const animate = React.useCallback(() => {
    Animated.timing(bottom, {
      toValue: 20,
      duration,
      useNativeDriver: false,
    }).start(() => {
      Animated.timing(bottom, {
        toValue: -120,
        duration,
        delay: 1500,
        useNativeDriver: false,
      }).start(() => {
        hideToast();
      });
    });
  }, [bottom, duration, hideToast]);

  React.useEffect(() => {
    animate();
  }, [type, animate]);

  const selectedVariant = variants[type as keyof typeof variants];

  return (
    <Animated.View
      style={[
        tw`flex-row px-4 py-2.5 absolute left-4 right-4 rounded-lg z-50`,
        { bottom, backgroundColor: type === 'success' ? '#dcfce7' : '#fee2e2' },
      ]}
    >
      <Icon
        size={32}
        name={selectedVariant.icon}
        color={selectedVariant.style}
      />
      <View style={tw`ml-3`}>
        <Text style={tw`font-bold`}>{selectedVariant.title}</Text>
        <Text style={{ fontSize: 15 }}>{message}</Text>
      </View>
    </Animated.View>
  );
};

const ToastContainer: React.FC = () => {
  const { toast } = useToast();

  if (!toast) return null;

  return <Toast {...toast} />;
};

export { Toast, ToastContainer };
