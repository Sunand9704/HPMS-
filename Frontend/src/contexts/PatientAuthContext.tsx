import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { tokenManager } from '@/lib/api';

interface Patient {
  id: string;
  name: string;
  email: string;
  age: number;
  gender: string;
  phone: string;
  status: string;
}

interface PatientAuthContextType {
  patient: Patient | null;
  isAuthenticated: boolean;
  login: (patient: Patient, token: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const PatientAuthContext = createContext<PatientAuthContextType | undefined>(undefined);

export const usePatientAuth = () => {
  const context = useContext(PatientAuthContext);
  if (context === undefined) {
    throw new Error('usePatientAuth must be used within a PatientAuthProvider');
  }
  return context;
};

interface PatientAuthProviderProps {
  children: ReactNode;
}

export const PatientAuthProvider: React.FC<PatientAuthProviderProps> = ({ children }) => {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if there's a stored token on app load
    const token = tokenManager.getToken();
    if (token) {
      // In a real app, you would verify the token with the backend
      // For now, we'll just check if it exists
      const isAuthenticated = tokenManager.isAuthenticated();
      if (isAuthenticated) {
        // You could decode the token to get patient info
        // For now, we'll set a placeholder
        setPatient({
          id: 'temp',
          name: 'Patient',
          email: 'patient@example.com',
          age: 0,
          gender: 'Other',
          phone: '',
          status: 'Active'
        });
      }
    }
    setIsLoading(false);
  }, []);

  const login = (patientData: Patient, token: string) => {
    tokenManager.setToken(token);
    setPatient(patientData);
  };

  const logout = () => {
    tokenManager.removeToken();
    setPatient(null);
  };

  const value: PatientAuthContextType = {
    patient,
    isAuthenticated: !!patient,
    login,
    logout,
    isLoading
  };

  return (
    <PatientAuthContext.Provider value={value}>
      {children}
    </PatientAuthContext.Provider>
  );
};
