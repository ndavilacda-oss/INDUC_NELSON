// API services to connect with full-stack Gemini server backend

export interface ApprenticeProfile {
  apprenticeName: string;
  documentNumber: string;
  email: string;
  phone: string;
  regional: string;
  trainingCenter: string;
  trainingProgram: string;
  level: string;
  priorSena: boolean;
  priorSenaDetails: string;
  expectation: string;
}

export interface CaseStudy {
  title: string;
  description: string;
  question: string;
  theme: string;
  correctPathDescription: string;
}

export interface EvaluationResult {
  status: 'CORRECTA' | 'PARCIALMENTE_CORRECTA' | 'INCORRECTA';
  score: number;
  feedback: string;
  applicableArticle: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export async function generateCase(profile: ApprenticeProfile): Promise<CaseStudy> {
  const response = await fetch('/api/gemini/generate-case', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile),
  });
  if (!response.ok) {
    throw new Error('No se pudo generar el caso interactivo con la IA.');
  }
  return response.json();
}

export async function evaluateAnswer(
  caseData: CaseStudy,
  apprenticeAnswer: string,
  apprenticeProfile: ApprenticeProfile
): Promise<EvaluationResult> {
  const response = await fetch('/api/gemini/evaluate-answer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ caseData, apprenticeAnswer, apprenticeProfile }),
  });
  if (!response.ok) {
    throw new Error('Error al enviar la respuesta para evaluación por la IA.');
  }
  return response.json();
}

export async function sendTutorMessage(
  messages: ChatMessage[],
  apprenticeProfile: ApprenticeProfile
): Promise<{ text: string }> {
  const response = await fetch('/api/gemini/chat-tutor', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, apprenticeProfile }),
  });
  if (!response.ok) {
    throw new Error('Error de conexión con el tutor IA.');
  }
  return response.json();
}
