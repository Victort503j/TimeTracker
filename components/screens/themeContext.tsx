import React, { createContext, useState, useContext, ReactNode } from 'react';

// Crear el contexto
interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: (value?: boolean) => void; // Permite un valor opcional
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Proveedor del contexto
interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Función que acepta un argumento opcional
  const toggleDarkMode = (value?: boolean) => {
    if (typeof value === 'boolean') {
      setIsDarkMode(value);
    } else {
      setIsDarkMode((prevState) => !prevState); // Alternar si no se pasa argumento
    }
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook personalizado
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
