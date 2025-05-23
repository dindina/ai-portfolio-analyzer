
export interface TickerInsight {
  symbol: string;
  riskRating?: number;
  growthRating?: number;
  analysis: string;
}

export interface PortfolioAnalysis {
  tickerInsights: TickerInsight[];
  summary: string | null;
  rawResponse?: string; // Optional: to store the full response if parsing fails partially
}

export interface PortfolioItem {
  id: string;
  symbol: string;
  allocation: number;
}

export interface AnalysisInsight {
  title: string;
  content: string; // Could be markdown or plain text
}

// Grounding chunk from Gemini API response
export interface GroundingChunkWeb {
  // FIX: Made uri optional to match @google/genai SDK's GroundingChunkWeb type.
  uri?: string;
  // FIX: Made title optional to match @google/genai SDK's GroundingChunkWeb type for consistency.
  title?: string;
}

export interface GroundingChunk {
  web?: GroundingChunkWeb;
  // other types of chunks could be defined here
}

export interface GroundingMetadata {
  groundingChunks?: GroundingChunk[];
  // other metadata fields
}

export interface Candidate {
  groundingMetadata?: GroundingMetadata;
  // other candidate fields
}