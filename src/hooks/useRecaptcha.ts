import { useCallback } from 'react';

declare global {
  interface Window {
    grecaptcha?: {
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

export const useRecaptcha = () => {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '';

  const getToken = useCallback(async (): Promise<string> => {
    if (!window.grecaptcha) {
      console.warn('reCAPTCHA not loaded - proceeding without token');
      return '';
    }

    try {
      const token = await window.grecaptcha.execute(siteKey, { action: 'register' });
      return token || '';
    } catch (error) {
      console.warn('reCAPTCHA token fetch failed:', error);
      return '';
    }
  }, [siteKey]);

  const resetRecaptcha = useCallback(() => {
    // No-op for now
  }, []);

  return { getToken, resetRecaptcha, isReady: true };
};
