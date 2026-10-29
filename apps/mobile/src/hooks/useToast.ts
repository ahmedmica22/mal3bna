import { useState, useRef } from 'react';
import { Animated } from 'react-native';
import { ToastMessage } from '../types/domain';

export type ShowToastFn = (
  type: 'success' | 'error' | 'warning' | 'info',
  title: string,
  message: string,
) => void;

export function useToast() {
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const toastAnim = useRef(new Animated.Value(-120)).current;

  function showToast(
    type: 'success' | 'error' | 'warning' | 'info',
    title: string,
    message: string,
  ) {
    setToast({ type, title, message });
    Animated.spring(toastAnim, {
      toValue: 20,
      useNativeDriver: true,
      tension: 70,
      friction: 10,
    }).start();

    setTimeout(() => {
      Animated.timing(toastAnim, {
        toValue: -140,
        duration: 250,
        useNativeDriver: true,
      }).start(() => setToast(null));
    }, 3500);
  }

  function dismissToast() {
    Animated.timing(toastAnim, {
      toValue: -140,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setToast(null));
  }

  return {
    toast,
    toastAnim,
    showToast,
    dismissToast,
  };
}
