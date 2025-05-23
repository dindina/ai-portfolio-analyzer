
import { Component, OnInit } from '@angular/core';
import { PortfolioItem, Candidate } from '../types';
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
  insights: string | null = null;
  isLoading: boolean = false;
  error: string | null = null;
  groundingSources: Candidate['groundingMetadata'] | null = null;

  constructor(private geminiService: GeminiService) { }

  ngOnInit() {
    // Initial setup or data loading if needed
  }

  async handlePortfolioSubmit(items: PortfolioItem[]): Promise<void> {
    this.portfolioItems = items;
    this.isLoading = true;
    this.error = null;
    this.insights = null;
    this.groundingSources = null;

    if (items.length === 0) {
      this.error = "Portfolio cannot be empty. Please add at least one asset.";
      this.isLoading = false;
      return;
    }

    // Basic validation for total allocation can be added here if desired.

    try {
      const geminiResponse = await this.geminiService.analyzePortfolio(items);
      this.insights = geminiResponse.candidates?.[0]?.content?.parts?.[0]?.text || null;
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
}
