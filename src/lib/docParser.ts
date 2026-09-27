import * as mammoth from 'mammoth';
import { SurveyQuestion } from '../types';

export async function parseDocxFile(file: File): Promise<{ text: string; detectedQuestions: SurveyQuestion[] }> {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  const text = result.value;

  // Simple heuristic parser for question patterns (e.g. "1. Você sente...", "2) Como você...")
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  const detectedQuestions: SurveyQuestion[] = [];
  
  let qCounter = 1;
  for (const line of lines) {
    if (/^(\d+[\.\)\-]|[a-zA-Z][\.\)])\s+[A-ZÀ-Ú]/.test(line) && line.length > 15) {
      const cleanText = line.replace(/^(\d+[\.\)\-]|[a-zA-Z][\.\)])\s+/, '');
      detectedQuestions.push({
        id: `imported-q-${qCounter}`,
        domain: qCounter % 2 === 0 ? 'ritmo' : 'exigencias',
        domainLabel: 'Dimensão Importada',
        text: cleanText,
        options: [
          { label: 'Nunca / Raramente', value: 1 },
          { label: 'Às vezes', value: 2 },
          { label: 'Com frequência', value: 3 },
          { label: 'Muito frequentemente', value: 4 },
          { label: 'Sempre', value: 5 }
        ]
      });
      qCounter++;
    }
  }

  return {
    text,
    detectedQuestions
  };
}
