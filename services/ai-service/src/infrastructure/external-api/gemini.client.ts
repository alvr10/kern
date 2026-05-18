import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

@Injectable()
export class GeminiClient implements OnModuleInit {
  private genAI: GoogleGenerativeAI;
  private model: GenerativeModel;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is required');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-3.1-flash-lite-preview' });
  }

  async generateText(prompt: string, systemInstruction?: string): Promise<{ text: string; tokensUsed: number }> {
    try {
      const result = await this.model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        systemInstruction: systemInstruction ? { role: 'system', parts: [{ text: systemInstruction }] } : undefined,
      });

      const response = await result.response;
      const text = response.text();

      // Rough estimation of tokens if not provided by API
      // Gemini API provides usageMetadata in the response
      const tokensUsed = response.usageMetadata?.totalTokenCount || text.split(' ').length * 1.5;

      return {
        text,
        tokensUsed: Math.ceil(tokensUsed),
      };
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw new Error(`AI generation failed: ${error.message}`, { cause: error });
    }
  }
}
