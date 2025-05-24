import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

// Define a more specific type for your analysis result and insights if you have one
// For example:
// interface TickerInsight {
//   symbol: string;
//   riskRating?: number;
//   growthRating?: number;
//   analysis: string;
// }

// interface AnalysisResult {
//   tickerInsights?: TickerInsight[];
//   // ... other properties
// }

@Component({
  selector: 'app-insight-display',
  templateUrl: './insight-display.component.html',
  styleUrls: ['./insight-display.component.css'] // or .scss
})
export class InsightDisplayComponent implements OnChanges {
  @Input() analysisResult: any; // Replace 'any' with your AnalysisResult interface if available
  @Input() groundingMetadata: any; // Assuming this is another input you might have

  public tickerExpandedState: boolean[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['analysisResult'] && this.analysisResult?.tickerInsights) {
      this.tickerExpandedState = new Array(this.analysisResult.tickerInsights.length).fill(false);
    }
  }

  toggleTicker(index: number): void {
    if (this.tickerExpandedState[index] !== undefined) {
      this.tickerExpandedState[index] = !this.tickerExpandedState[index];
    }
  }
}