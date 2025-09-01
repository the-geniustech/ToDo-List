'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { NotFound } from './NotFound';

interface NotFoundContextType {
  showNotFound: (options?: NotFoundOptions) => void;
  hideNotFound: () => void;
  isVisible: boolean;
}

interface NotFoundOptions {
  title?: string;
  subtitle?: string;
  onGoHome?: () => void;
  onGoBack?: () => void;
}

const NotFoundContext = createContext<NotFoundContextType | undefined>(undefined);

export const useNotFound = () => {
  const context = useContext(NotFoundContext);
  if (!context) {
    throw new Error('useNotFound must be used within a NotFoundProvider');
  }
  return context;
};

interface NotFoundProviderProps {
  children: React.ReactNode;
}

export const NotFoundProvider: React.FC<NotFoundProviderProps> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [options, setOptions] = useState<NotFoundOptions>({});

  const showNotFound = useCallback((notFoundOptions: NotFoundOptions = {}) => {
    setOptions(notFoundOptions);
    setIsVisible(true);
  }, []);

  const hideNotFound = useCallback(() => {
    setIsVisible(false);
    setOptions({});
  }, []);

  const value = {
    showNotFound,
    hideNotFound,
    isVisible,
  };

  return (
    <NotFoundContext.Provider value={value}>
      {children}
      {isVisible && (
        <div className="fixed inset-0 z-50">
          <NotFound
            title={options.title}
            subtitle={options.subtitle}
            onGoHome={options.onGoHome || hideNotFound}
            onGoBack={options.onGoBack || hideNotFound}
          />
        </div>
      )}
    </NotFoundContext.Provider>
  );
};