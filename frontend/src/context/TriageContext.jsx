import { createContext, useContext, useState } from 'react';
import { mockPatientQueue } from '../services/mockData';

const TriageContext = createContext();

export function TriageProvider({ children }) {
  const [currentPatient, setCurrentPatient] = useState(null);
  const [triageResult, setTriageResult] = useState(null);
  const [streamEvents, setStreamEvents] = useState([]);
  const [patientQueue, setPatientQueue] = useState(mockPatientQueue);

  const submitPatient = (patient) => {
    setCurrentPatient(patient);
    setTriageResult(null);
    setStreamEvents([]);
  };

  const addStreamEvent = (event) => {
    setStreamEvents((prev) => [...prev, event]);
  };

  const setResult = (result) => {
    setTriageResult(result);
    setPatientQueue((prev) => {
      const exists = prev.find((p) => p.patient_id === result.patient_id);
      if (exists) return prev;
      return [result, ...prev];
    });
  };

  const getPatientById = (id) => patientQueue.find((p) => p.patient_id === id);

  return (
    <TriageContext.Provider
      value={{
        currentPatient, submitPatient,
        triageResult, setResult,
        streamEvents, addStreamEvent, setStreamEvents,
        patientQueue, setPatientQueue,
        getPatientById,
      }}
    >
      {children}
    </TriageContext.Provider>
  );
}

export function useTriage() {
  const ctx = useContext(TriageContext);
  if (!ctx) throw new Error('useTriage must be used within TriageProvider');
  return ctx;
}
