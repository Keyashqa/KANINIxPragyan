export const mockPatientInput = {
  patient_id: 'PAT-2024-0042',
  name: 'Lakshmi Devi',
  age: 58,
  gender: 'Female',
  vitals: {
    heart_rate: 112,
    blood_pressure_systolic: 168,
    blood_pressure_diastolic: 95,
    temperature: 37.2,
    spo2: 93,
  },
  symptoms: ['Chest pain', 'Shortness of breath', 'Palpitations', 'Dizziness'],
  medical_history: ['Hypertension', 'Diabetes Mellitus Type 2'],
};


const ClassificationResult = {
  patient_id: "PT-2026-00127",
  patient_name: "Lakshmi Devi",
  age: 72,
  gender: "Female",
  symptoms: ["dizziness", "weakness", "fatigue", "nausea"],
  conditions: ["diabetes", "hypertension"],
  vitals: {
    bp_systolic: 155,
    bp_diastolic: 95,
    heart_rate: 95,
    temperature: 98.4,
    spo2: 94
  },
  prediction: {
    risk_level: "High",
    risk_code: 0,
    confidence: {
      High: 71.3,
      Low: 0.0,
      Medium: 28.7
    },
    max_confidence: 71.3
  },
  derived_metrics: {
    vital_severity_score: 2,
    vital_severity_level: "normal",
    comorbidity_risk_score: 2,
    comorbidity_level: "moderate"
  }
};

const CardiologyAgent = {
  specialty: "Cardiology",
  relevance_score: 9,
  urgency_score: 9,
  confidence: "HIGH",
  assessment:
    "This 55-year-old male presents with chest pain and sweating, a symptom combination highly concerning for acute coronary syndrome. Vitals show blood pressure of 160/100 mmHg and heart rate of 105 bpm, indicating significant hypertension with tachycardia. Given his history of hypertension and current presentation, an acute myocardial infarction must be urgently ruled out. Immediate cardiac evaluation is warranted.",
  one_liner: "Chest pain with diaphoresis in hypertensive patient. Rule out acute MI.",
  flags: [
    {
      severity: "RED_FLAG",
      label: "Possible Acute Coronary Syndrome",
      pattern: "chest pain + sweating + tachycardia = ACS concern",
    },
    {
      severity: "YELLOW_FLAG",
      label: "Uncontrolled Hypertension",
      pattern: "BP 160/100 mmHg",
    },
    {
      severity: "YELLOW_FLAG",
      label: "Tachycardia",
      pattern: "HR 105 bpm",
    },
  ],
  claims_primary: true,
  recommended_department: "Cardiology",
  differential_considerations: [
    {
      condition: "Acute Myocardial Infarction",
      likelihood: "HIGH",
      reasoning:
        "Chest pain with sweating in a hypertensive 55-year-old male is strongly suggestive of myocardial ischemia.",
    },
    {
      condition: "Unstable Angina",
      likelihood: "HIGH",
      reasoning:
        "Classic ischemic symptoms with cardiovascular risk factors require urgent evaluation.",
    },
    {
      condition: "Hypertensive Urgency",
      likelihood: "MODERATE",
      reasoning:
        "Blood pressure of 160/100 mmHg with symptoms necessitates assessment for cardiac stress or end-organ effects.",
    },
    {
      condition: "Tachyarrhythmia",
      likelihood: "MODERATE",
      reasoning:
        "Heart rate of 105 bpm may represent a physiological response or underlying rhythm disturbance.",
    },
  ],
  recommended_workup: [
    {
      test: "12-lead ECG",
      priority: "STAT",
      rationale: "Immediate assessment for ischemic changes or arrhythmia.",
    },
    {
      test: "Troponin I/T",
      priority: "STAT",
      rationale: "Detect myocardial injury.",
    },
    {
      test: "Aspirin (loading dose)",
      priority: "STAT",
      rationale:
        "Antiplatelet therapy if ACS is suspected and no contraindications exist.",
    },
    {
      test: "Echocardiogram",
      priority: "URGENT",
      rationale: "Evaluate wall motion abnormalities and cardiac function.",
    },
    {
      test: "Chest X-Ray",
      priority: "ROUTINE",
      rationale: "Assess alternate causes of chest pain and cardiac silhouette.",
    },
  ],
};


const OtherSpecialtyAgent = {
  specialty: "Department Triage",
  departments: [
    {
      department: "Orthopedics",
      relevance: 0,
      reason: null
    },
    {
      department: "ENT",
      relevance: 0,
      reason: null
    },
    {
      department: "Dermatology",
      relevance: 0,
      reason: null
    },
    {
      department: "Ophthalmology",
      relevance: 0,
      reason: null
    },
    {
      department: "Pediatrics",
      relevance: 0,
      reason: null
    },
    {
      department: "Obstetrics & Gynecology",
      relevance: 0,
      reason: null
    },
    {
      department: "Psychiatry",
      relevance: 0,
      reason: null
    },
    {
      department: "Urology",
      relevance: 0,
      reason: null
    },
    {
      department: "Nephrology",
      relevance: 2,
      reason: null
    },
    {
      department: "Endocrinology",
      relevance: 3,
      reason: "Hypertension may have endocrine associations."
    },
    {
      department: "Oncology",
      relevance: 0,
      reason: null
    },
    {
      department: "Infectious Disease",
      relevance: 0,
      reason: null
    },
    {
      department: "General Surgery",
      relevance: 0,
      reason: null
    }
  ]
};

const GeneralMedicineAgent = {
  specialty: "General Medicine",
  relevance_score: 8,
  urgency_score: 6,
  confidence: "MEDIUM",
  assessment:
    "This 55-year-old male with known hypertension presents with chest pain and sweating. Vitals show elevated blood pressure (160/100 mmHg) and tachycardia (heart rate 105 bpm), with normal temperature and oxygen saturation. The ML model predicts High Risk. While an acute cardiac event is a major concern, a general medicine evaluation is essential to assess systemic contributors such as metabolic disturbances or secondary complications of hypertension.",
  one_liner: "55M with HTN, chest pain, sweating, BP 160/100, HR 105. Needs urgent medical workup.",
  flags: [
    {
      severity: "YELLOW_FLAG",
      label: "Elevated Blood Pressure",
      pattern: "BP 160/100 mmHg + chest pain = possible end-organ stress"
    },
    {
      severity: "YELLOW_FLAG",
      label: "Tachycardia",
      pattern: "heart_rate 105 bpm + chest pain = requires evaluation"
    },
    {
      severity: "INFO",
      label: "High-Risk ML Prediction",
      pattern: "ML model indicates High Risk classification"
    }
  ],
  claims_primary: true,
  recommended_department: "General Medicine",
  differential_considerations: [
    {
      condition: "Acute Coronary Syndrome",
      likelihood: "HIGH",
      reasoning: "Chest pain and sweating in a 55-year-old hypertensive patient are concerning for ACS."
    },
    {
      condition: "Hypertensive Urgency",
      likelihood: "HIGH",
      reasoning: "Blood pressure of 160/100 mmHg with symptoms suggests possible hypertensive urgency."
    },
    {
      condition: "Anxiety or Stress Response",
      likelihood: "MODERATE",
      reasoning: "Sweating and tachycardia may reflect a stress response, though serious causes must be excluded first."
    }
  ],
  recommended_workup: [
    {
      test: "Electrocardiogram (ECG)",
      priority: "STAT",
      rationale: "Immediate screening for cardiac ischemia is necessary in chest pain."
    },
    {
      test: "Cardiac Enzymes (Troponin I/T)",
      priority: "URGENT",
      rationale: "Helps detect myocardial injury if ACS is present."
    },
    {
      test: "Basic Metabolic Panel (BMP)",
      priority: "URGENT",
      rationale: "Evaluates electrolytes and renal status in a hypertensive patient."
    },
    {
      test: "Complete Blood Count (CBC)",
      priority: "ROUTINE",
      rationale: "Screens for anemia or infection contributing to symptoms."
    },
    {
      test: "Random Blood Glucose",
      priority: "URGENT",
      rationale: "Detects hyper/hypoglycemia that may mimic or worsen symptoms."
    }
  ]
};

const NeurologyAgent = {
  specialty: "Neurology",
  relevance_score: 6,
  urgency_score: 5,
  confidence: "MEDIUM",
  assessment:
    "The patient presents with chest pain and sweating, along with a history of hypertension. Blood pressure is elevated at 160/100 with a mildly increased heart rate of 105. While the dominant symptoms are cardiac, uncontrolled hypertension carries a background risk of acute neurological complications. Insufficient neurological examination data is available. However, vigilance for evolving neurological symptoms is advised.",
  one_liner: "Hypertensive patient with chest pain. Monitor for neurological changes.",
  flags: [
    {
      severity: "INFO",
      label: "Hypertension Risk Noted",
      pattern: "Hypertension + elevated BP = increased cerebrovascular risk"
    }
  ],
  claims_primary: false,
  recommended_department: null,
  differential_considerations: [
    {
      condition: "Hypertensive Encephalopathy",
      likelihood: "LOW",
      reasoning:
        "BP 160/100 is elevated but below levels typically associated with encephalopathy, and no confusion or headache is reported."
    },
    {
      condition: "Posterior Circulation Ischemia",
      likelihood: "LOW",
      reasoning:
        "Hypertension is a risk factor, but no dizziness, visual disturbance, or focal deficit symptoms are documented."
    }
  ],
  recommended_workup: [
    {
      test: "Focused Neurological Examination",
      priority: "URGENT",
      rationale: "To rule out subtle deficits given hypertension and cardiovascular stress."
    },
    {
      test: "Blood Glucose (Stat)",
      priority: "STAT",
      rationale: "Hypoglycemia can mimic neurological events and should be rapidly excluded."
    }
  ]
};


const PulmonologyAgent = {
  specialty: "Pulmonology",
  relevance_score: 7,
  urgency_score: 6,
  confidence: "MEDIUM",
  assessment:
    "The patient presents with chest pain and sweating. Oxygen saturation is 96%, which is within acceptable range, but the heart rate is elevated at 105 bpm alongside blood pressure of 160/100 mmHg. Although no primary respiratory symptoms are documented, chest pain with tachycardia requires consideration of pulmonary causes. The presentation overlaps strongly with cardiac etiologies, but pulmonary embolism or early pulmonary edema should be excluded where clinically appropriate.",
  one_liner: "Chest pain with tachycardia. Evaluate cardiopulmonary causes.",
  flags: [
    {
      severity: "YELLOW_FLAG",
      label: "Tachycardia With Chest Pain",
      pattern: "HR 105 + chest pain = cardiopulmonary stress",
    },
  ],
  claims_primary: false,
  recommended_department: null,
  differential_considerations: [
    {
      condition: "Pulmonary Embolism",
      likelihood: "MODERATE",
      reasoning:
        "Chest pain with tachycardia can be seen in pulmonary embolism even when SpO2 remains near normal.",
    },
    {
      condition: "Acute Pulmonary Edema",
      likelihood: "MODERATE",
      reasoning:
        "Severe hypertension (160/100) may precipitate early pulmonary congestion despite preserved SpO2.",
    },
    {
      condition: "Atypical Pneumonia",
      likelihood: "LOW",
      reasoning:
        "No fever, cough, or hypoxia is documented, making infection less likely.",
    },
  ],
  recommended_workup: [
    {
      test: "Chest X-Ray (PA View)",
      priority: "URGENT",
      rationale:
        "To evaluate for pulmonary edema, consolidation, or other thoracic pathology.",
    },
    {
      test: "D-Dimer",
      priority: "ROUTINE",
      rationale:
        "Screening test when pulmonary embolism is a clinical consideration.",
    },
  ],
};


const EmergencyMedicineAgent = {
  specialty: "Emergency Medicine",
  relevance_score: 8,
  urgency_score: 8,
  confidence: "HIGH",
  assessment:
    "This 55-year-old male with known hypertension presents with chest pain and sweating. Vitals show blood pressure of 160/100 mmHg and heart rate of 105 bpm, indicating significant hypertension with tachycardia. Oxygen saturation is 96%, which is reassuring but does not exclude serious pathology. Given the symptom profile and risk factors, immediate emergency department evaluation is warranted to rule out acute coronary syndrome and other life-threatening causes.",
  one_liner: "Chest pain with sweating and tachycardia. Urgent ED evaluation required.",
  flags: [
    {
      severity: "YELLOW_FLAG",
      label: "Hypertension",
      pattern: "BP 160/100",
    },
    {
      severity: "YELLOW_FLAG",
      label: "Tachycardia",
      pattern: "HR 105",
    },
    {
      severity: "INFO",
      label: "High ML Risk",
      pattern: "ML prediction: High",
    },
  ],
  claims_primary: true,
  recommended_department: "Emergency Department",
  differential_considerations: [
    {
      condition: "Acute Coronary Syndrome",
      likelihood: "HIGH",
      reasoning:
        "Chest pain with diaphoresis in a hypertensive 55-year-old male is highly concerning for ACS.",
    },
    {
      condition: "Hypertensive Urgency",
      likelihood: "HIGH",
      reasoning:
        "Blood pressure of 160/100 mmHg with symptoms requires evaluation for end-organ effects.",
    },
    {
      condition: "Pulmonary Embolism",
      likelihood: "MODERATE",
      reasoning:
        "Chest pain with tachycardia may represent PE even with near-normal oxygen saturation.",
    },
    {
      condition: "Aortic Dissection",
      likelihood: "LOW",
      reasoning:
        "Hypertension is a risk factor, though no tearing pain or radiation is documented.",
    },
  ],
  recommended_workup: [
    {
      test: "ECG",
      priority: "STAT",
      rationale: "Immediate screening for myocardial ischemia or infarction.",
    },
    {
      test: "Troponin I/T",
      priority: "STAT",
      rationale: "To detect myocardial injury.",
    },
    {
      test: "Chest X-Ray",
      priority: "URGENT",
      rationale: "To evaluate pulmonary pathology and cardiac silhouette.",
    },
    {
      test: "Basic Labs (CBC, CMP)",
      priority: "URGENT",
      rationale: "Assess metabolic status and systemic abnormalities.",
    },
    {
      test: "Blood Glucose",
      priority: "URGENT",
      rationale: "Exclude glycemic abnormalities contributing to symptoms.",
    },
  ],
};


const ChiefMedicalOfficerData = {
  patient_id: "PT-POSTMAN-001",
  patient_name: "Ravi Kumar",
  final_risk_level: "Critical",
  ml_risk_level: "High",
  risk_adjusted: true,
  risk_adjustment_reason:
    "Escalated from High to Critical due to Cardiology RED_FLAG for high suspicion of Acute MI and Emergency Medicine concurrence on the urgency.",
  confidence: 0.99,
  primary_department: "Cardiology",
  secondary_department: "Emergency Medicine",
  referral_needed: false,
  referral_details: null,
  specialist_summaries: [
    {
      specialty: "Cardiology",
      relevance_score: 9.0,
      urgency_score: 9.0,
      confidence: "HIGH",
      one_liner: "High risk patient with chest pain, sweating, HTN, and tachycardia: Rule out acute MI.",
      claims_primary: true,
      flag_count: 3,
      red_flag_count: 1,
      agreed_with_final: true
    },
    {
      specialty: "Emergency Medicine",
      relevance_score: 8.0,
      urgency_score: 8.0,
      confidence: "HIGH",
      one_liner: "55M with HTN, chest pain, sweating, hypertensive urgency, and tachycardia requires urgent ED workup for potential ACS.",
      claims_primary: true,
      flag_count: 3,
      red_flag_count: 0,
      agreed_with_final: true
    },
    {
      specialty: "General Medicine",
      relevance_score: 8.0,
      urgency_score: 6.0,
      confidence: "MEDIUM",
      one_liner: "55M HTN c/o chest pain, sweating. BP 160/100, HR 105. High ML risk. Needs workup.",
      claims_primary: true,
      flag_count: 3,
      red_flag_count: 1,
      agreed_with_final: true
    },
    {
      specialty: "Pulmonology",
      relevance_score: 7.0,
      urgency_score: 6.0,
      confidence: "MEDIUM",
      one_liner: "Chest pain, sweating, HTN, HR 105, SpO2 96%. Possible cardiopulmonary concern.",
      claims_primary: false,
      flag_count: 1,
      red_flag_count: 0,
      agreed_with_final: true
    },
    {
      specialty: "Neurology",
      relevance_score: 6.0,
      urgency_score: 5.0,
      confidence: "MEDIUM",
      one_liner: "Hypertensive patient with chest pain. Monitor for new neurological symptoms.",
      claims_primary: false,
      flag_count: 1,
      red_flag_count: 0,
      agreed_with_final: false
    }
  ],
  council_consensus: "Majority",
  dissenting_opinions: [
    "Neurology: While hypertension is noted, the primary focus should remain cardiac, and neurological sequelae are not the immediate concern."
  ],
  other_departments_flagged: [
    {
      department: "Nephrology",
      relevance: 2.0,
      reason: "Hypertension is a risk factor for kidney disease."
    },
    {
      department: "Endocrinology",
      relevance: 3.0,
      reason: "Hypertension can be related to endocrine disorders."
    }
  ],
  safety_alerts: [
    {
      source_specialty: "Cardiology",
      severity: "CRITICAL",
      label: "High Suspicion for Acute MI",
      action_required: "Order STAT ECG and Aspirin 300mg PO immediately."
    },
    {
      source_specialty: "General Medicine",
      severity: "CRITICAL",
      label: "Hypertensive Urgency - Rule Out End-Organ Damage",
      action_required: "Administer anti-hypertensives as per protocol for hypertensive urgency; closely monitor BP."
    },
    {
      source_specialty: "Cardiology",
      severity: "WARNING",
      label: "Uncontrolled Hypertension with Cardiac Symptoms",
      action_required: "Ensure BP is managed aggressively while ruling out ACS."
    },
    {
      source_specialty: "Pulmonology",
      severity: "WARNING",
      label: "Tachycardia with Chest Pain - Rule Out PE/Pulmonary Edema",
      action_required: "Consider Chest X-ray and D-Dimer if cardiac workup is non-diagnostic."
    }
  ],
  explanation:
    "The specialist council has identified a critical cardiac emergency for this 55-year-old male. His symptoms of chest pain and sweating, combined with his history of hypertension and concerning vital signs (elevated BP and heart rate), strongly suggest an acute heart attack. Despite the ML model predicting high risk, the Cardiology and General Medicine specialists flagged this as a critical concern requiring immediate intervention. He is being routed to Cardiology for urgent evaluation and treatment.",
  key_factors: [
    "High suspicion for Acute Myocardial Infarction (Cardiology RED_FLAG)",
    "Hypertensive Urgency with symptoms (General Medicine RED_FLAG)",
    "Chest pain and sweating in a 55-year-old male with hypertension",
    "Elevated BP (160/100 mmHg) and heart rate (105 bpm)"
  ],
  priority_score: 98,
  recommended_action: "Immediate",
  consolidated_workup: [
    {
      test: "12-lead ECG",
      priority: "STAT",
      ordered_by: ["Cardiology", "Emergency Medicine", "General Medicine"],
      rationale: "Essential for identifying ST-segment changes indicative of myocardial infarction."
    },
    {
      test: "Troponin I/T",
      priority: "STAT",
      ordered_by: ["Cardiology", "Emergency Medicine", "General Medicine"],
      rationale: "Crucial biomarker for detecting myocardial injury."
    },
    {
      test: "Aspirin 300mg PO",
      priority: "STAT",
      ordered_by: ["Cardiology"],
      rationale: "Inhibit platelet aggregation if Acute Coronary Syndrome is suspected."
    },
    {
      test: "Basic Labs (CBC, CMP, Coags)",
      priority: "URGENT",
      ordered_by: ["Emergency Medicine", "General Medicine"],
      rationale: "Assess overall metabolic status, infection, electrolytes, and bleeding risk."
    },
    {
      test: "Chest X-ray (PA View)",
      priority: "URGENT",
      ordered_by: ["Pulmonology", "Emergency Medicine", "General Medicine"],
      rationale: "Evaluate for other causes of chest pain or heart failure."
    },
    {
      test: "Random Blood Glucose",
      priority: "URGENT",
      ordered_by: ["Emergency Medicine", "General Medicine"],
      rationale: "Screen for glucose factors contributing to symptoms."
    },
    {
      test: "D-Dimer",
      priority: "ROUTINE",
      ordered_by: ["Pulmonology"],
      rationale: "Assess for PE if cardiac workup is non-diagnostic."
    }
  ]
};



export const mockClassificationResult = ClassificationResult;

export const mockSpecialistOpinions = [
  CardiologyAgent,
  NeurologyAgent,
  PulmonologyAgent,
  EmergencyMedicineAgent,
  GeneralMedicineAgent,
  OtherSpecialtyAgent
];

