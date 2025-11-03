import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';
type ColorScheme = 'blue' | 'purple' | 'green' | 'orange' | 'red';

interface ThemeContextType {
  theme: Theme;
  colorScheme: ColorScheme;
  toggleTheme: () => void;
  setColorScheme: (scheme: ColorScheme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const colorSchemes = {
  blue: {
    light: { primary: '#0a84ff', ring: '#0a84ff' },
    dark: { primary: '#0a84ff', ring: '#0a84ff' }
  },
  purple: {
    light: { primary: '#af52de', ring: '#af52de' },
    dark: { primary: '#bf5af2', ring: '#bf5af2' }
  },
  green: {
    light: { primary: '#34c759', ring: '#34c759' },
    dark: { primary: '#32d74b', ring: '#32d74b' }
  },
  orange: {
    light: { primary: '#ff9500', ring: '#ff9500' },
    dark: { primary: '#ff9f0a', ring: '#ff9f0a' }
  },
  red: {
    light: { primary: '#ff3b30', ring: '#ff3b30' },
    dark: { primary: '#ff453a', ring: '#ff453a' }
  }
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const saved = localStorage.getItem('theme');
      return (saved as Theme) || 'light';
    } catch (error) {
      return 'light';
    }
  });

  const [colorScheme, setColorSchemeState] = useState<ColorScheme>(() => {
    try {
      const saved = localStorage.getItem('colorScheme');
      return (saved as ColorScheme) || 'blue';
    } catch (error) {
      return 'blue';
    }
  });

  useEffect(() => {
    try {
      const root = document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(theme);
      localStorage.setItem('theme', theme);
      
      // Apply color scheme
      const colors = colorSchemes[colorScheme][theme];
      root.style.setProperty('--primary', colors.primary);
      root.style.setProperty('--ring', colors.ring);
      localStorage.setItem('colorScheme', colorScheme);
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  }, [theme, colorScheme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const setColorScheme = (scheme: ColorScheme) => {
    setColorSchemeState(scheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, colorScheme, toggleTheme, setColorScheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
