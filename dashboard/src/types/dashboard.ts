// Mock data types for Samudra Prahari Dashboard
// In real implementation, these would be synced with Supabase schema

export type HazardType = 
  | 'HIGH_WAVES' 
  | 'SWELL_SURGE' 
  | 'COASTAL_FLOODING' 
  | 'UNUSUAL_TIDE' 
  | 'TSUNAMI_SIGHTING' 
  | 'OTHER'
  // Adding old mock types for wider compatibility
  | 'High Waves'
  | 'Coastal Flooding'
  | 'Cyclone'
  | 'Storm Surge'
  | 'Tsunami Warning'
  | 'Erosion';

export interface HazardReport {
  id: string;
  type: HazardType;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Verified' | 'Unverified' | 'Dismissed' | 'Approved';
  source: 'Citizen App' | 'Social Media' | 'Official Agency' | 'Ship Sensor';
  location: {
    lat: number;
    lng: number;
    name: string;
  };
  timestamp: Date;
  description: string;
  confidence: number; // 0-100
  reportedBy: string;
  imageUrl?: string;
  aiAnalysis?: {
    confidence: number;
    tags: string[];
    risk_level: string;
  };
  event_id?: string;
}

export type SourcePlatform = 'X' | 'INSTAGRAM' | 'FACEBOOK' | 'TWITTER';

export interface SocialPost {
  id: string;
  sourcePlatform: SourcePlatform;
  authorId: string | null;
  contentText: string | null;
  postedAt: Date;
  postUrl: string;
  imageUrl?: string;
  status: 'PENDING' | 'PROCESSED' | 'DISCARDED';
}

export interface DashboardStats {
  totalReports: number;
  verifiedEvents: number;
  reportsLastHour: number;
  activeAlerts: number;
}

export interface FilterState {
  timeRange: 'Last 1 Hour' | 'Last 6 Hours' | 'Today' | 'Last 7 Days' | 'Custom';
  customRange?: {
    start: Date;
    end: Date;
  };
  hazardTypes: string[];
  sources: string[];
  statuses: string[];
  confidenceRange: [number, number];
}

