export const RISK_COLORS = {
  CRITICAL: '#D32F2F',
  HIGH: '#F57C00',
  MEDIUM: '#FBC02D',
  LOW: '#388E3C',
};

export const RISK_BG_COLORS = {
  CRITICAL: '#FFEBEE',
  HIGH: '#FFF3E0',
  MEDIUM: '#FFFDE7',
  LOW: '#E8F5E9',
};

export const FLAG_COLORS = {
  RED_FLAG: { bg: '#FFEBEE', color: '#D32F2F', label: 'Red Flag' },
  YELLOW_FLAG: { bg: '#FFF8E1', color: '#F57C00', label: 'Yellow Flag' },
  INFO: { bg: '#E3F2FD', color: '#1A73E8', label: 'Info' },
};

export const PRIORITY_COLORS = {
  high: '#D32F2F',
  medium: '#F57C00',
  low: '#388E3C',
};

export const ACTION_COLORS = {
  IMMEDIATE: { bg: '#D32F2F', color: '#FFF' },
  URGENT: { bg: '#F57C00', color: '#FFF' },
  STANDARD: { bg: '#1A73E8', color: '#FFF' },
  'CAN WAIT': { bg: '#388E3C', color: '#FFF' },
};

export const DEPARTMENT_ICONS = {
  Cardiology: 'FavoriteOutlined',
  Neurology: 'PsychologyOutlined',
  Pulmonology: 'AirOutlined',
  'Emergency Medicine': 'LocalHospitalOutlined',
  'General Medicine': 'MedicalServicesOutlined',
  Orthopedics: 'AccessibilityNewOutlined',
  Gastroenterology: 'ScienceOutlined',
  Nephrology: 'WaterDropOutlined',
};

export const SYMPTOM_LIST = [
  'Chest pain', 'Shortness of breath', 'Headache', 'Dizziness',
  'Nausea', 'Vomiting', 'Fever', 'Cough', 'Fatigue', 'Weakness',
  'Abdominal pain', 'Back pain', 'Joint pain', 'Swelling',
  'Palpitations', 'Blurred vision', 'Numbness', 'Tingling',
  'Loss of consciousness', 'Seizures', 'Difficulty breathing',
  'Wheezing', 'Blood in stool', 'Blood in urine', 'Weight loss',
  'Night sweats', 'Confusion', 'Anxiety', 'Insomnia', 'Loss of appetite',
];

export const CONDITION_LIST = [
  'Hypertension', 'Diabetes Mellitus Type 2', 'Coronary Artery Disease',
  'Asthma', 'COPD', 'Chronic Kidney Disease', 'Heart Failure',
  'Stroke', 'Epilepsy', 'Thyroid Disorder', 'Anemia',
  'Tuberculosis', 'Liver Disease',
];

export const SPECIALISTS = [
  'Cardiology', 'Neurology', 'Pulmonology', 'Emergency Medicine', 'General Medicine',
];
