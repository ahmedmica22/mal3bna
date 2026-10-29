import { ThemeType } from '../../constants/theme';
import { Language } from '../../constants/translations';
export interface AuthScreenProps {
  onLogin: (email: string, pass: string, defaultRole?: 'player') => Promise<void>;
  onRegister: (params: {
    name: string;
    email: string;
    phone?: string;
    password: string;
    role?: 'player';
  }) => Promise<void>;
  isLoggingIn: boolean;
  theme?: ThemeType;
  lang?: Language;
}
