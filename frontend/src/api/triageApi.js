import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

function fahrenheitToCelsius(f) {
  return ((f - 32) * 5) / 9;
}

export async function startTriage(patientData) {
  const payload = {
    ...patientData,
    temperature: fahrenheitToCelsius(patientData.temperature),
  };
  const { data } = await api.post('/triage', payload);
  return data;
}

export function connectSSE(sessionId, handlers) {
  const es = new EventSource(`/api/triage/stream/${sessionId}`);

  const events = [
    'status',
    'classification_result',
    'specialist_opinion',
    'other_specialty_scores',
    'cmo_verdict',
    'complete',
    'error',
  ];

  events.forEach((evt) => {
    es.addEventListener(evt, (e) => {
      try {
        const data = JSON.parse(e.data);
        handlers[evt]?.(data);
      } catch {
        handlers[evt]?.(e.data);
      }
    });
  });

  es.onerror = () => {
    handlers.error?.({ message: 'SSE connection lost' });
    es.close();
  };

  return es;
}

export async function getPatients() {
  const { data } = await api.get('/dashboard/patients');
  return data;
}

export async function getStats() {
  const { data } = await api.get('/dashboard/stats');
  return data;
}

export async function uploadDocument(file) {
  const form = new FormData();
  form.append('file', file);
  const { data } = await api.post('/upload/document', form);
  return data;
}
