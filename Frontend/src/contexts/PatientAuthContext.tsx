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

interface Doctor {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
}

interface PatientAuthContextType {
  patient: Patient | null;
  doctor: Doctor | null;
  isAuthenticated: boolean;
  login: (user: Patient | Doctor, token: string) => void;
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
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if there's a stored token on app load
    const token = tokenManager.getToken();
    if (token) {
      // In a real app, you would verify the token with the backend
      // For now, we'll just check if it exists
      const isAuthenticated = tokenManager.isAuthenticated();
      if (isAuthenticated) {
        // You could decode the token to get user info
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

  const login = (userData: Patient | Doctor, token: string) => {
    tokenManager.setToken(token);
    
    // Check if it's a patient or doctor based on the data structure
    if ('age' in userData) {
      // It's a patient
      setPatient(userData as Patient);
      setDoctor(null);
    } else {
      // It's a doctor
      setDoctor(userData as Doctor);
      setPatient(null);
    }
  };

  const logout = () => {
    tokenManager.removeToken();
    setPatient(null);
    setDoctor(null);
  };

  const value: PatientAuthContextType = {
    patient,
    doctor,
    isAuthenticated: !!(patient || doctor),
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
