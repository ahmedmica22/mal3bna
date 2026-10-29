import { errorMessage as getErrorMessage } from '../../../utils/errors';
import { styles } from '../styles';
import type { AuthScreenProps } from '../contracts';
import { useState } from 'react';
export function useAuthScreen({ onLogin, onRegister, isLoggingIn }: AuthScreenProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('micaahmed666@gmail.com');
  const [phoneInput, setPhoneInput] = useState('');
  const [passInput, setPassInput] = useState('Password123!');
  const role = 'player' as const;
  const setRole = () => {};
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit() {
    setErrorMessage('');
    if (isSignUp) {
      if (!nameInput.trim()) {
        setErrorMessage('Please enter your full name');
        return;
      }
      if (!emailInput.trim()) {
        setErrorMessage('Please enter your email address');
        return;
      }
      if (!passInput || passInput.length < 8) {
        setErrorMessage('Password must be at least 8 characters');
        return;
      }
      try {
        await onRegister({
          name: nameInput.trim(),
          email: emailInput.trim(),
          phone: phoneInput.trim() || undefined,
          password: passInput,
          role,
        });
      } catch (err) {
        setErrorMessage(getErrorMessage(err, 'Registration failed'));
      }
    } else {
      if (!emailInput.trim()) {
        setErrorMessage('Please enter your email or mobile number');
        return;
      }
      if (!passInput) {
        setErrorMessage('Please enter your password');
        return;
      }
      try {
        await onLogin(emailInput.trim(), passInput.trim());
      } catch (err) {
        setErrorMessage(getErrorMessage(err, 'Invalid credentials'));
      }
    }
  }

  async function handleFastLogin(email: string, pass: string) {
    setEmailInput(email);
    setPassInput(pass);
    setErrorMessage('');
    try {
      await onLogin(email.trim(), pass.trim());
    } catch (err) {
      setErrorMessage(getErrorMessage(err, 'Invalid credentials'));
    }
  }

  return {
    view: 'Content',
    props: {
      emailInput,
      errorMessage,
      handleSubmit,
      handleFastLogin,
      isLoggingIn,
      isSignUp,
      nameInput,
      passInput,
      phoneInput,
      role,
      setEmailInput,
      setErrorMessage,
      setIsSignUp,
      setNameInput,
      setPassInput,
      setPhoneInput,
      setRole,
      styles,
    },
  } as const;
}
