import { mockSSEEvents, mockPatientQueue, mockDashboardStats } from './mockData';

export const USE_MOCK = true;

export async function submitTriage(patientData, onEvent) {
  if (USE_MOCK) {
    return runMockStream(onEvent);
  }
  return runRealStream(patientData, onEvent);
}

async function runMockStream(onEvent) {
  for (const { delay, event } of mockSSEEvents) {
    await new Promise((r) => setTimeout(r, delay));
    onEvent(event);
  }
}

async function runRealStream(patientData, onEvent) {
  const response = await fetch('/api/run/stream', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patientData),
  });

  if (!response.ok) throw new Error(`HTTP ${response.status}`);

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        try {
          const data = JSON.parse(line.slice(6));
          onEvent(data);
        } catch {
          // skip malformed JSON
        }
      }
    }
  }
}

export async function getPatients() {
  if (USE_MOCK) return mockPatientQueue;
  const res = await fetch('/api/patients');
  return res.json();
}

export async function getStats() {
  if (USE_MOCK) return mockDashboardStats;
  const res = await fetch('/api/stats');
  return res.json();
}
