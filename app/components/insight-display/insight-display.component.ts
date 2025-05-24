
import { Component, Input } from '@angular/core';
import { Candidate, GroundingChunkWeb, PortfolioAnalysis } from '../../../types'; // Ensure correct path to types

@Component({
  selector: 'app-insight-display',
  templateUrl: './insight-display.component.html',
  styleUrls: ['./insight-display.component.css']
})
export class InsightDisplayComponent {
  @Input() analysisResult: PortfolioAnalysis | null = null;
  @Input() groundingMetadata: Candidate['groundingMetadata'] | null = null;

  constructor() { }

  get webSources(): GroundingChunkWeb[] {
    if (!this.groundingMetadata || !this.groundingMetadata.groundingChunks) {
      return [];
    }
    return this.groundingMetadata.groundingChunks
      .filter(chunk => chunk.web && chunk.web.uri && chunk.web.title)
      .map(chunk => chunk.web as GroundingChunkWeb);
  }
}
