
import { Injectable } from '@angular/core';
import { GenerativeModel, GoogleGenerativeAI, GenerateContentResponse } from '@google/generative-ai'; // Updated imports
import { PortfolioItem } from '../../types';
import { GEMINI_MODEL_NAME } from '../../constants';
import { environment } from "../../environments/environment"

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: GenerativeModel;

  constructor() {
    // IMPORTANT: API Key handling.
    // As per guidelines, API_KEY must be obtained exclusively from process.env.API_KEY
    // and assumed to be pre-configured, valid, and accessible.
    // FIX: Adhere to API key guideline, using process.env.API_KEY directly.
    // The '!' non-null assertion is used because the guidelines state to assume the key is available and valid.
    //if (!process.env.GOOGLE_API_KEY) {
    // This check is a safeguard. Guidelines assume it's always present.
    // In a real application, you might want more robust handling if this assumption could be violated.
    console.error("CRITICAL: API_KEY environment variable is not set. The application may not function correctly.");
    // Throwing an error here would prevent the service from being created in an invalid state.
    // However, sticking to "assume it's pre-configured", we proceed, but the SDK will likely fail.
    //}
    this.genAI = new GoogleGenerativeAI(environment.api_key);
    this.model = this.genAI.getGenerativeModel({
      model: GEMINI_MODEL_NAME,
      tools: [{ googleSearch: {} } as any], // Configure tools at model level
    });
  }
  // FIX: Added a return type to the analyzePortfolio function.

  private _buildAnalysisPrompt(items: PortfolioItem[]): string {
    const portfolioDescription = items.map(item =>
      `- (${item.symbol}): ${item.allocation}% allocation`
    ).join('\n');

    return `
Analyze the following investment portfolio and provide insights.
The portfolio consists of:
${portfolioDescription}

Consider factors like diversification, potential risks, sector exposure, and alignment with common investment goals (e.g., growth, income, capital preservation).
Provide a concise summary of the analysis, highlight key observations, and suggest potential areas for improvement or consideration.
If possible, use Google Search for up-to-date information on the assets or market conditions if relevant to the analysis.
Present the analysis clearly.Respond with a rating based on 1 to 10 for each ticker symbol and its risk and growth prospects
    `;
  }

  async analyzePortfolio(items: PortfolioItem[]): Promise<GenerateContentResponse> {
    if (!this.model) { // Check if the model is initialized
      // This case should ideally not be hit if the constructor succeeds and API key is present.
      console.error("Gemini AI SDK not initialized. This likely indicates an issue with API Key configuration during startup.");
      throw new Error("Gemini AI SDK not initialized. Check API Key configuration.");
    }
    const prompt = this._buildAnalysisPrompt(items);

    try {
      // Tools are configured at the model level in the constructor.
      // If you need to override or specify tools per request, it would be part of a GenerateContentRequest object.
      // For a simple string prompt with model-level tools:
      const result = await this.model.generateContent(prompt);
      const apiResponse = result.response;
      return apiResponse;
    } catch (error: any) { // Specify 'any' for caught error for broader compatibility, or 'unknown' and type check
      console.error('Error calling Gemini API:', error);
      if (error instanceof Error) {
        throw new Error(`Gemini API Error: \${error.message}`);
      }
      throw new Error('An unknown error occurred while communicating with the Gemini API.');
    }
  }
}
