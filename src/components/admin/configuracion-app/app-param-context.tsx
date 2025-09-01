import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { IAppParamFilters } from '@/interface/admin/app-param';

interface IAppParamContext {
  filters: IAppParamFilters;
  setFilters: (filters: IAppParamFilters) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
}

const AppParamContext = createContext<IAppParamContext | undefined>(undefined);

export const AppParamProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [filters, setFiltersState] = useState<IAppParamFilters>({});

  const setFilters = useCallback((newFilters: IAppParamFilters) => {
    setFiltersState(newFilters);
  }, []);

  const clearFilters = useCallback(() => {
    setFiltersState({});
  }, []);

  const hasActiveFilters = Object.keys(filters).some(key => {
    const value = filters[key as keyof IAppParamFilters];
    return value !== undefined && value !== '' && value !== null;
  });

  return (
    <AppParamContext.Provider 
      value={{ 
        filters, 
        setFilters, 
        clearFilters, 
        hasActiveFilters 
      }}
    >
      {children}
    </AppParamContext.Provider>
  );
};

export const useAppParamContext = (): IAppParamContext => {
  const context = useContext(AppParamContext);
  if (!context) {
    throw new Error('useAppParamContext must be used within an AppParamProvider');
  }
  return context;
};
