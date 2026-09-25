import express from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const PORT = Number(process.env.PORT) || 3000;

// Initialize GoogleGenAI client on the server
const aiClient = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// System Prompt with SENA Regulation knowledge (Acuerdo 009 de 2012 and Reglamento del Aprendiz)
const SENA_REGULATION_SYSTEM_PROMPT = `
Eres un Instructor Tutor de Inducción del SENA (Servicio Nacional de Aprendizaje de Colombia).
Tu objetivo es guiar, evaluar y responder preguntas del aprendiz basadas estrictamente en el Reglamento del Aprendiz SENA (Acuerdo 009 de 2012).

Conoces perfectamente la estructura institucional:
1. Qué es el SENA: Entidad pública encargada de la formación profesional integral en Colombia, fundada en 1957 por Rodolfo Martínez Tono. Gratuita y de alta calidad.
2. Símbolos:
   - Piñón (industria y metalmecánica)
   - Caduceo (comercio y servicios)
   - Hoja de café (sector primario y agropecuario)
   - Escudo, Bandera e Himno.
3. Organización: Dirección General (Jorge Eduardo Londoño Ulloa), 33 Regionales (una en cada departamento más Distrito Capital), 117 Centros de Formación.
4. Derechos del Aprendiz (Artículos clave del Reglamento):
   - Recibir formación profesional integral de calidad.
   - Uso de instalaciones, laboratorios, biblioteca e internet del centro.
   - Participar en programas de bienestar (apoyos socioeconómicos, salud, deporte, cultura).
   - Expresar libremente sus opiniones con respeto.
   - Ser escuchado y recibir debido proceso ante faltas disciplinarias.
5. Deberes del Aprendiz (Artículos clave):
   - Mantener una actitud ética, de respeto y honestidad académica.
   - Portar debidamente el carné del SENA y el uniforme (si aplica) de forma digna.
   - Asistir puntualmente a todas las actividades formativas programadas.
   - Cuidar los bienes, materiales y equipos de los centros de formación.
   - Cumplir con las actividades de la Etapa Lectiva y de la Etapa Práctica.
6. Faltas y Sanciones (Medidas Formativas):
   - Faltas académicas o disciplinarias (Leves, Graves, Gravísimas).
   - Debido Proceso: Comité de Evaluación y Seguimiento.
   - Sanciones: Llamado de atención escrito, Plan de Mejoramiento, Condicionamiento de matrícula, Cancelación de matrícula.
7. Etapa Práctica: Modalidades válidas (Contrato de Aprendizaje, Proyecto Productivo, Pasantías, Monitorías, Vínculo laboral).

Tu comportamiento y tono:
- Profesional, inspirador, empático, con identidad y jerga institucional del SENA ("Estimado aprendiz", "Instructor", "Formación Profesional Integral").
- Proporciona respuestas claras, estructuradas con viñetas si es necesario, y siempre citando el Reglamento del Aprendiz cuando hables de deberes, derechos, faltas o procesos.
- Si te piden evaluar un caso, analízalo detalladamente, califica la actitud del aprendiz en el caso y propón el plan de mejoramiento o la medida correcta de acuerdo al reglamento.
`;

// API endpoint to generate a custom scenario based on Apprentice Profile
app.post('/api/gemini/generate-case', async (req, res) => {
  if (!aiClient) {
    return res.status(500).json({ error: 'GEMINI_API_KEY no configurada en el servidor.' });
  }

  const { apprenticeName, trainingProgram, level, priorSena, expectation } = req.body;

  const prompt = `
  Por favor genera un "Caso de Estudio del Reglamento" realista, desafiante y contextualizado para el aprendiz ${apprenticeName}, que está cursando el programa "${trainingProgram}" (Nivel: ${level}).
  Considera que el aprendiz ${priorSena ? 'ya tiene formación previa en el SENA' : 'es completamente nuevo en la institución'}.
  Su expectativa es: "${expectation}".

  El caso debe plantear un dilema ético, académico o de convivencia en el contexto de su programa formativo.
  Ejemplos de temas: plagio en entregables, inasistencias injustificadas, conflicto con un compañero en el taller de formación, pérdida de equipos, o dudas sobre la etapa práctica.

  Entrega la respuesta estrictamente en formato JSON con la siguiente estructura (no agregues texto fuera de ella, solo el JSON puro):
  {
    "title": "Título del caso relacionado con su especialidad",
    "description": "Una narrativa corta (100-150 palabras) del caso que le ocurre al aprendiz ficticio en el taller o aula.",
    "question": "Pregunta reflexiva dirigida al aprendiz para que decida qué hacer basada en los Deberes o Derechos.",
    "theme": "Tema específico (ej. Honestidad Académica, Respeto y Convivencia, Uso de Equipos)",
    "correctPathDescription": "Explicación interna de cuál es la solución correcta basada en el Reglamento del Aprendiz y Acuerdo 009 de 2012."
  }
  `;

  try {
    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        systemInstruction: SENA_REGULATION_SYSTEM_PROMPT,
      },
    });

    const text = response.text || '{}';
    res.json(JSON.parse(text));
  } catch (error: any) {
    console.error('Error al generar caso con Gemini:', error);
    res.status(500).json({ error: error.message || 'Error al comunicarse con Gemini.' });
  }
});

// API endpoint to evaluate the apprentice's response to the study case
app.post('/api/gemini/evaluate-answer', async (req, res) => {
  if (!aiClient) {
    return res.status(500).json({ error: 'GEMINI_API_KEY no configurada en el servidor.' });
  }

  const { caseData, apprenticeAnswer, apprenticeProfile } = req.body;

  const prompt = `
  Analiza la respuesta dada por el aprendiz al caso planteado:
  
  --- DETALLES DEL CASO ---
  Título: ${caseData.title}
  Tema: ${caseData.theme}
  Descripción: ${caseData.description}
  Pregunta: ${caseData.question}
  Solución ideal esperada: ${caseData.correctPathDescription}

  --- PERFIL DEL APRENDIZ ---
  Nombre: ${apprenticeProfile.apprenticeName}
  Programa: ${apprenticeProfile.trainingProgram} (Nivel: ${apprenticeProfile.level})

  --- RESPUESTA DEL APRENDIZ ---
  "${apprenticeAnswer}"

  Por favor evalúa la respuesta de forma constructiva e instructiva. Dile si su decisión es correcta, parcialmente correcta o incorrecta según el Reglamento del Aprendiz.
  Menciona qué Deberes o Derechos están en juego y qué artículo o apartado del reglamento (Acuerdo 009) se aplica.
  Ofrece consejos prácticos y motivadores en tu rol de Instructor SENA.

  Entrega la respuesta estrictamente en formato JSON con la siguiente estructura:
  {
    "status": "CORRECTA" | "PARCIALMENTE_CORRECTA" | "INCORRECTA",
    "score": número de 0 a 100,
    "feedback": "Explicación detallada y enriquecedora en tono de instructor SENA, motivando al aprendiz y dándole la cita del reglamento.",
    "applicableArticle": "Artículo X del Reglamento (Título, descripción corta)"
  }
  `;

  try {
    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        systemInstruction: SENA_REGULATION_SYSTEM_PROMPT,
      },
    });

    const text = response.text || '{}';
    res.json(JSON.parse(text));
  } catch (error: any) {
    console.error('Error al evaluar la respuesta con Gemini:', error);
    res.status(500).json({ error: error.message || 'Error al comunicarse con Gemini.' });
  }
});

// API endpoint to act as a free-form chat tutor for SENA induction questions
app.post('/api/gemini/chat-tutor', async (req, res) => {
  if (!aiClient) {
    return res.status(500).json({ error: 'GEMINI_API_KEY no configurada.' });
  }

  const { messages, apprenticeProfile } = req.body;

  // Build content parts
  const systemText = `
  ${SENA_REGULATION_SYSTEM_PROMPT}
  
  Estás chateando con el aprendiz ${apprenticeProfile.apprenticeName || 'Invitado'}, del programa "${apprenticeProfile.trainingProgram || 'General'}" de la Regional "${apprenticeProfile.regional || 'Colombia'}" en el centro "${apprenticeProfile.trainingCenter || 'SENA'}".
  Responde con entusiasmo, claridad institucional, y siempre cita de forma comprensible el Reglamento del Aprendiz (Acuerdo 009 de 2012) o los símbolos/historia institucional según corresponda. Mantén tus respuestas relativamente concisas (máximo 150 palabras por mensaje) pero sumamente profesionales y afectuosas.
  `;

  try {
    // Format the history for Gemini SDK
    const formattedContents = messages.map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }],
    }));

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: formattedContents,
      config: {
        systemInstruction: systemText,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error('Error en tutor chat:', error);
    res.status(500).json({ error: error.message || 'Error al comunicarse con el tutor IA.' });
  }
});

// Serve frontend and handle development/production modes
const isProd = process.env.NODE_ENV === 'production' || fs.existsSync(path.resolve(__dirname, 'dist'));

if (isProd) {
  // Serve compiled production build assets
  const distPath = path.resolve(__dirname, 'dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(distPath, 'index.html'));
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor full-stack en producción corriendo en puerto ${PORT}`);
  });
} else {
  // Dev mode with Vite middleware
  import('vite').then((vite) => {
    vite.createServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
      appType: 'spa',
    }).then((viteServer) => {
      app.use(viteServer.middlewares);
      
      app.use('*', async (req, res, next) => {
        const url = req.originalUrl;
        try {
          let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
          template = await viteServer.transformIndexHtml(url, template);
          res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
        } catch (e) {
          viteServer.ssrFixStacktrace(e as Error);
          next(e);
        }
      });

      app.listen(PORT, '0.0.0.0', () => {
        console.log(`Servidor de desarrollo full-stack corriendo en puerto ${PORT}`);
      });
    });
  });
}
