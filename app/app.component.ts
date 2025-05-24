
import { Component, OnInit } from '@angular/core';
import { PortfolioItem, Candidate, PortfolioAnalysis, TickerInsight, ChatMessage } from '../types';
import { GeminiService } from './services/gemini.service';
import { APP_TITLE } from '../constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = APP_TITLE;
  portfolioItems: PortfolioItem[] = [];
  analysisResult: PortfolioAnalysis | null = null;
  isLoading: boolean = false;
  error: string | null = null;
  groundingSources: Candidate['groundingMetadata'] | null = null;

  chatHistory: ChatMessage[] = [];
  isChatLoading: boolean = false;
  chatError: string | null = null;

  constructor(private geminiService: GeminiService) { }

  private parseAnalysisResponse(responseText: string): PortfolioAnalysis {
    const result: PortfolioAnalysis = { tickerInsights: [], summary: null, rawResponse: responseText };

    // Extract Summary
    const summaryMatch = responseText.match(/START_SUMMARY\s*Overall Portfolio Summary:([\s\S]*?)END_SUMMARY/);
    if (summaryMatch && summaryMatch[1]) {
      result.summary = summaryMatch[1].trim();
    }

    // Extract Ticker Data
    // Split by the main separator first, or handle cases where it might not exist if only one item
    const parts = responseText.split(/--- SEPARATOR ---/);
    const tickerDataRegex = /START_TICKER_DATA([\s\S]*?)END_TICKER_DATA/g;

    parts.forEach(part => {
      let match;
      // Process each START_TICKER_DATA...END_TICKER_DATA block within the part
      // This handles cases where the AI might not use "--- SEPARATOR ---" correctly but still uses the blocks
      const individualTickerBlocks = part.matchAll(tickerDataRegex);
      for (const blockMatch of individualTickerBlocks) {
        const content = blockMatch[1];
        const tickerInsight: Partial<TickerInsight> = {};

        const symbolMatch = content.match(/Ticker:\s*(.+)/);
        if (symbolMatch) tickerInsight.symbol = symbolMatch[1].trim();

        const riskMatch = content.match(/Risk Rating \(1-10\):\s*(\d+)/);
        if (riskMatch) tickerInsight.riskRating = parseInt(riskMatch[1], 10);

        const growthMatch = content.match(/Growth Rating \(1-10\):\s*(\d+)/);
        if (growthMatch) tickerInsight.growthRating = parseInt(growthMatch[1], 10);

        const analysisMatch = content.match(/Analysis:\s*([\s\S]+)/);
        if (analysisMatch) tickerInsight.analysis = analysisMatch[1].trim();

        if (tickerInsight.symbol && tickerInsight.analysis) {
          result.tickerInsights.push(tickerInsight as TickerInsight);
        }
      }
    });

    // If no specific ticker insights were parsed but there's text not part of summary,
    // treat it as a general analysis if the detailed parsing fails.
    if (result.tickerInsights.length === 0 && !result.summary) {
      // This is a fallback if the AI completely ignores the structure
      // and there's no summary block.
      const potentialFallbackText = responseText.replace(/START_SUMMARY[\s\S]*END_SUMMARY/, "").trim();
      if (potentialFallbackText) {
        // Add a generic insight if specific parsing fails
        result.tickerInsights.push({
          symbol: "General",
          analysis: potentialFallbackText,
        });
      }
    } else if (result.tickerInsights.length === 0 && result.summary && responseText.replace(/START_SUMMARY[\s\S]*END_SUMMARY/, "").trim().length > 0) {
      // If there's a summary but no ticker data, and other text exists, also treat as general
      const otherText = responseText.replace(/START_SUMMARY[\s\S]*END_SUMMARY/, "").trim();
      if (otherText && !otherText.includes("START_TICKER_DATA")) { // Avoid re-adding if it was just unparsed ticker data
        result.tickerInsights.push({
          symbol: "General Observations",
          analysis: otherText,
        });
      }
    }


    return result;
  }

  ngOnInit() {
    // Initial setup or data loading if needed
  }

  async handlePortfolioSubmit(items: PortfolioItem[]): Promise<void> {
    this.portfolioItems = items;
    this.isLoading = true;
    this.error = null;
    this.analysisResult = null;
    this.groundingSources = null;

    if (items.length === 0) {
      this.error = "Portfolio cannot be empty. Please add at least one asset.";
      this.isLoading = false;
      return;
    }

    // Basic validation for total allocation can be added here if desired.

    try {
      const geminiResponse = await this.geminiService.analyzePortfolio(items);
      const responseText = geminiResponse.candidates?.[0]?.content?.parts?.[0]?.text;
      if (responseText) {
        this.analysisResult = this.parseAnalysisResponse(responseText);
      } else {
        this.analysisResult = { tickerInsights: [], summary: "No content received from AI.", rawResponse: "" };
      }
      if (geminiResponse.candidates && geminiResponse.candidates[0]?.groundingMetadata) {
        this.groundingSources = geminiResponse.candidates[0].groundingMetadata;
      }
    } catch (err: any) {
      console.error("Error analyzing portfolio:", err);
      this.error = err.message || "An unknown error occurred while generating insights. Ensure your API key is correctly configured if using direct API calls.";
    } finally {
      this.isLoading = false;
    }
  }

  async handleChatMessageSend(question: string): Promise<void> {
    if (!this.portfolioItems || this.portfolioItems.length === 0) {
      this.chatError = "Cannot ask follow-up questions without an active portfolio analysis.";
      return;
    }

    this.chatHistory.push({ sender: 'user', text: question, timestamp: new Date() });
    this.isChatLoading = true;
    this.chatError = null;

    try {
      const previousSummary = this.analysisResult?.summary;
      const geminiResponse = await this.geminiService.askFollowUpQuestion(this.portfolioItems, previousSummary, question);
      const aiText = geminiResponse.candidates?.[0]?.content?.parts?.[0]?.text;

      if (aiText) {
        this.chatHistory.push({ sender: 'ai', text: aiText, timestamp: new Date() });
      } else {
        this.chatHistory.push({ sender: 'ai', text: "Sorry, I couldn't generate a response for that.", timestamp: new Date() });
      }
    } catch (err: any) {
      console.error("Error in chat:", err);
      this.chatError = err.message || "An error occurred during the chat.";
      this.chatHistory.push({ sender: 'ai', text: `Error: ${this.chatError}`, timestamp: new Date() });
    } finally {
      this.isChatLoading = false;
    }
  }
}
