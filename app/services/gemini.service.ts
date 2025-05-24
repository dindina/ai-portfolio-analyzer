
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
      `- - ${item.name} (${item.symbol}): ${item.allocation}% allocation`
    ).join('\n');

    return `
Analyze the following investment portfolio and provide insights.
The portfolio consists of ticker symbol and its allocation:
${portfolioDescription}

For each ticker symbol in the portfolio, provide the following information in the exact format below:
START_TICKER_DATA
Ticker: [SYMBOL_HERE]
Risk Rating (1-10): [RISK_RATING_HERE]
Growth Rating (1-10): [GROWTH_RATING_HERE]
Analysis: [SHORT_ANALYSIS]
END_TICKER_DATA

--- SEPARATOR --- (Use this exact separator between each ticker's data. If only one ticker, this separator is not needed after its data.)

After all ticker data, provide an overall summary in the following format:
START_SUMMARY
Overall Portfolio Summary: [YOUR_CONCISE_PORTFOLIO_SUMMARY_HERE]
END_SUMMARY

Example for one ticker:
START_TICKER_DATA
Ticker: AAPL
Risk Rating (1-10): 3
Growth Rating (1-10): 7
Analysis: Apple shows strong growth potential due to its innovative products and market position. However, its high valuation presents some risk.
END_TICKER_DATA

--- SEPARATOR --- (Example separator if more tickers followed)

START_SUMMARY
Overall Portfolio Summary: The portfolio is well-diversified across growth and value assets, offering a balanced approach to risk and potential returns.
END_SUMMARY

Ensure all requested information is provided for each ticker.
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

  private _buildFollowUpPrompt(portfolioItems: PortfolioItem[], previousAnalysisSummary: string | null | undefined, question: string): string {
    const portfolioDescription = portfolioItems.map(item =>
      `- ${item.name} (${item.symbol}): ${item.allocation}% allocation`
    ).join('\n');

    let context = `The user has an investment portfolio consisting of:\n${portfolioDescription}\n\n`;

    if (previousAnalysisSummary) {
      context += `An initial analysis provided this summary: "${previousAnalysisSummary}"\n\n`;
    } else {
      context += `An initial analysis was performed on this portfolio.\n\n`;
    }

    context += `Now, the user has a follow-up question: "${question}"\n\n`;
    context += `Please answer this question based on the portfolio and the context provided. Be concise and helpful.`;

    return context;
  }

  async askFollowUpQuestion(portfolioItems: PortfolioItem[], previousAnalysisSummary: string | null | undefined, question: string): Promise<GenerateContentResponse> {
    if (!this.model) {
      console.error("Gemini AI SDK not initialized for follow-up.");
      throw new Error("Gemini AI SDK not initialized.");
    }

    const prompt = this._buildFollowUpPrompt(portfolioItems, previousAnalysisSummary, question);

    try {
      const result = await this.model.generateContent(prompt);
      return result.response;
    } catch (error: any) {
      console.error('Error asking follow-up question to Gemini:', error);
      // It's good practice to check if the error has a message property
      const errorMessage = error.message || 'An unknown error occurred with the AI service.';
      throw new Error(`AI Follow-up Error: ${errorMessage}`);
    }
  }

}
