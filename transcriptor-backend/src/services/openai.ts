import { OpenAI } from 'openai';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Cargar variables de entorno
dotenv.config();

class OpenAIService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  public async processOpenAICall(transcription: string, transcriptionType: string): Promise<string> {
    const filePath = path.join(__dirname, `../../${transcriptionType}.txt`);
    console.log(`../../${transcriptionType}.txt`)
    if (!fs.existsSync(filePath)) {
      throw new Error('File not found');
    }
    
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const combinedContent = `${fileContent} ${transcription}`;
    const model = process.env.OPENAI_MODEL ?? 'gpt-4o';

    const completion = await this.openai.chat.completions.create({
      messages: [{ role: "system", content: combinedContent }],
      model: model,
    });

    return completion.choices[0].message?.content ?? 'No content available';
}
}

export const openAIService = new OpenAIService();