import { useEffect } from 'react';
import { useUIStore } from '../stores/ui.store';

export const useTheme = () => {
  const { theme, toggleTheme, setTheme } = useUIStore();

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
  }, [theme]);

  return {
    theme,
    toggleTheme,
    setTheme,
    isDark: theme === 'dark'
  };
};

export default useTheme;
