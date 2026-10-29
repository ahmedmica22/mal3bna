import i18next, { type i18n as I18nInstance } from 'i18next';
import { webArabic } from './web-ar.js';

export const resources = {
  en: {
    web: Object.fromEntries(Object.keys(webArabic).map((key) => [key, key])),
    translation: {
      brand: 'mal3bna',
      nav: {
        discover: 'Discover',
        bookings: 'My bookings',
        profile: 'Profile',
        signIn: 'Sign in',
        signOut: 'Sign out',
      },
      auth: {
        welcome: 'Welcome back',
        title: 'Ready to play?',
        email: 'Email',
        password: 'Password',
        login: 'Sign in',
        register: 'Create account',
        name: 'Full name',
        role: 'I am joining as',
        player: 'Player',
        owner: 'Venue owner',
        submitRegister: 'Create account',
        verify: 'Verify email',
        reset: 'Reset password',
        forgot: 'Forgot password?',
        resend: 'Resend verification',
        invalid: 'Please check your details and try again.',
      },
      shell: {
        tagline: 'Find the court that feels like home.',
        subtitle: 'Approved football and padel venues across Egypt.',
        visitor: 'Visitor',
        account: 'Account',
      },
      states: {
        loading: 'Loading…',
        empty: 'Nothing here yet.',
        error: 'Something went wrong.',
        retry: 'Try again',
      },
      language: { english: 'English', arabic: 'العربية', switch: 'Language' },
      roles: { player: 'Player', owner: 'Owner', admin: 'Admin' },
    },
  },
  ar: {
    web: webArabic,
    translation: {
      brand: 'ملعبنا',
      nav: {
        discover: 'اكتشف',
        bookings: 'حجوزاتي',
        profile: 'الملف الشخصي',
        signIn: 'تسجيل الدخول',
        signOut: 'تسجيل الخروج',
      },
      auth: {
        welcome: 'مرحباً بعودتك',
        title: 'جاهز للعب؟',
        email: 'البريد الإلكتروني',
        password: 'كلمة المرور',
        login: 'تسجيل الدخول',
        register: 'إنشاء حساب',
        name: 'الاسم الكامل',
        role: 'سأنضم بصفتي',
        player: 'لاعب',
        owner: 'مالك ملعب',
        submitRegister: 'إنشاء الحساب',
        verify: 'تأكيد البريد',
        reset: 'إعادة تعيين كلمة المرور',
        forgot: 'هل نسيت كلمة المرور؟',
        resend: 'إعادة إرسال التأكيد',
        invalid: 'يرجى مراجعة بياناتك والمحاولة مرة أخرى.',
      },
      shell: {
        tagline: 'اعثر على الملعب الذي يشبه بيتك.',
        subtitle: 'ملاعب كرة القدم والبادل المعتمدة في مصر.',
        visitor: 'زائر',
        account: 'الحساب',
      },
      states: {
        loading: 'جار التحميل…',
        empty: 'لا يوجد شيء هنا بعد.',
        error: 'حدث خطأ ما.',
        retry: 'حاول مرة أخرى',
      },
      language: { english: 'English', arabic: 'العربية', switch: 'اللغة' },
      roles: { player: 'لاعب', owner: 'مالك', admin: 'مشرف' },
    },
  },
} as const;

export const i18n: I18nInstance = i18next.createInstance();
export async function initializeI18n(language: 'en' | 'ar' = 'en'): Promise<I18nInstance> {
  await i18n.init({
    resources,
    lng: language,
    fallbackLng: 'en',
    initAsync: false,
    interpolation: { escapeValue: false },
  });
  return i18n;
}
export type Language = keyof typeof resources;
