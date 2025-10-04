// Updated schema-types.ts to match the new JSON structure

// Enums
export enum InvestigationStatus {
  RUNNING = "RUNNING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export enum ThreatLevel {
  NONE = "NONE",
  LOW = "LOW",
  MODERATE = "MODERATE",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}

export enum MediaType {
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
}

export enum SourceType {
  TWITTER = "twitter",
  INSTAGRAM = "instagram",
  WEB_PAGE = "web_page",
}

// --- Graph-specific types ---
export interface GraphNode {
  id: string;
  type: 'EVIDENCE' | 'MEDIA' | 'ANALYSIS' | 'AUTHOR';
}

export interface GraphEdge {
  source: string;
  target: string;
  label: string;
  properties?: {
    trust_score?: number;
    flag_reason?: string;
  }
}

export interface GraphContext {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

// Media and Evidence types
export interface MediaItem {
  media_id: string;
  media_type: MediaType;
  url: string;
  local_path?: string | null;
  access_url?: string | null;
}

export interface EvidenceItem {
  evidence_id: string;
  investigation_id?: string | null;
  cycle_id?: number | null;
  source_type: string;
  url: string;
  content: string;
  timestamp: string; // ISO 8601 date string or datetime string
  author_id: string;
  media: MediaItem[];
  mentioned_accounts: string[];
  hashtags: string[];
  raw_data?: Record<string, any> | null;
}

// Analysis types
export interface AnalysisResult {
  analysis_id: string;
  evidence_id: string;
  cycle_id?: number | null;
  flag_reason: string;
  trust_score: number;
  reasoning: string;
}

// Cycle decision types
export interface CycleDecision {
  cycle_id: number;
  query: string;
  decision_type: "continue" | "conclude";
  reasoning: string;
  timestamp: string;
  evidence_count: number;
  analysis_count: number;
}

// Timeline entry
export interface TimelineEntry {
  cycle: number;
  query: string;
  decision: "continue" | "conclude";
  reasoning: string;
  evidence_found: number;
  timestamp: string;
}

// Threat assessment
export interface ThreatAssessment {
  threat_level: ThreatLevel;
  average_trust_score: number;
  summary: string;
}

// Investigation summary
export interface InvestigationSummary {
  initial_query: string;
  total_cycles_completed: number;
  total_evidence_collected: number;
  total_analysis_completed: number;
  entities_investigated: string[];
  completion_reason: string;
  completion_timestamp: string;
}

// Final conclusion (updated structure)
export interface FinalConclusion {
  investigation_summary: InvestigationSummary;
  threat_assessment: ThreatAssessment;
  investigation_timeline: TimelineEntry[];
  recommendations: string[];
}

// Investigation cycle (simplified since data is already processed)
export interface InvestigationCycle {
  cycle_id: number;
  triggering_query: string;
  start_time: string;
  end_time?: string | null;
  evidence_collected: EvidenceItem[];
  analysis_results: AnalysisResult[];
  graph_context?: GraphContext | null;
}

// Main investigation interface (updated to match new JSON structure)
export interface Investigation {
  initial_query: string;
  investigation_id: string;
  cycle_id: number;
  current_query: string;
  messages: any[]; // Usually empty
  new_evidence: string[]; // Raw string representations
  new_analysis: AnalysisResult[];
  graph_context: GraphContext;
  investigation_cycles: any[]; // Raw cycle data
  next_query?: string | null;
  final_summary?: string | null;
  investigated_queries: string[];
  investigated_entities: string[];
  max_cycles: number;
  investigation_complete_reason: string;
  cycle_decisions: CycleDecision[];
  final_conclusion: FinalConclusion;
  
  // Computed properties for UI compatibility
  status?: InvestigationStatus;
  created_at?: string;
  updated_at?: string;
  vip_targets?: string[];
  processed_cycles?: InvestigationCycle[];
  processed_evidence?: EvidenceItem[];
}