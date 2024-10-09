import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { OpenAI } from 'openai';
import dotenv from 'dotenv';
import { openAIService } from './services/openai'; 
import path from 'path';

// Cargar variables de entorno
dotenv.config();

// Crea la aplicación Express
const app: Application = express();

// Middlewares
app.use(express.json());
app.use(cors());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Definición de la ruta POST
app.post('/process', async (req: Request, res: Response) => {
    const { transcription, transcriptionType } = req.body;

    if (!transcription || !transcriptionType) {
        res.status(400).json({ message: 'No transcription or transcriptionType provided' });
        return;
    }

    try {
        const detailTranscription = await openAIService.processOpenAICall(transcription, await promptByType("mainSummary"));
        const response = await openAIService.processOpenAICall(detailTranscription, await promptByType(transcriptionType));
        res.json({ response });
    } catch (error) {
        console.error('Error al procesar la solicitud de OpenAI:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

async function promptByType(type: String) {
   return path.join(process.cwd(), `${process.env.PROMPT_FILE}${type}.txt`);
}
  

// Configuración del puerto
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});