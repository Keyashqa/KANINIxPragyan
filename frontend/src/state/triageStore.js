import { create } from 'zustand';

const useTriageStore = create((set) => ({
  classification: null,
  specialists: [],
  otherSpecialty: null,
  verdict: null,
  streamEvents: [],
  phase: 'idle',
  isTriaging: false,
  sessionId: null,
  patientData: null,

  setClassification: (c) => set({ classification: c }),
  addSpecialist: (s) =>
    set((st) => ({ specialists: [...st.specialists, s] })),
  setOtherSpecialty: (o) => set({ otherSpecialty: o }),
  setVerdict: (v) => set({ verdict: v }),
  addStreamEvent: (e) =>
    set((st) => ({ streamEvents: [...st.streamEvents, { ...e, ts: Date.now() }] })),
  setPhase: (p) => set({ phase: p }),
  setIsTriaging: (b) => set({ isTriaging: b }),
  setSessionId: (id) => set({ sessionId: id }),
  setPatientData: (d) => set({ patientData: d }),

  reset: () =>
    set({
      classification: null,
      specialists: [],
      otherSpecialty: null,
      verdict: null,
      streamEvents: [],
      phase: 'idle',
      isTriaging: false,
      sessionId: null,
      patientData: null,
    }),
}));

export default useTriageStore;
