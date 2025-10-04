import { Investigation, InvestigationStatus, ThreatLevel } from './schema-types';
import { mockInvestigations } from './mock-data';

// Simulate network delay
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const apiClient = {
  // Get single investigation by ID
  getInvestigation: async (investigationId: string): Promise<Investigation | null> => {
    await delay(800);
    console.log(`Mock API: Fetching investigation ${investigationId}`);
    
    // Find investigation in mock data
    const investigation = mockInvestigations.find(
      inv => inv.investigation_id === investigationId
    );
    
    return investigation || null;
  },

  // Get all investigations
  getAllInvestigations: async (): Promise<Investigation[]> => {
    await delay(1000);
    console.log("Mock API: Fetching all investigations");
    
    // Return all mock investigations
    return [...mockInvestigations];
  },

  // Start new investigation (placeholder for future functionality)
  startInvestigation: async (query: string, vip_targets: string[]): Promise<{ investigation_id: string }> => {
    await delay(500);
    const newInvestigationId = `inv_${Date.now()}`;
    console.log(`Mock API: Starting investigation for query "${query}" with ID ${newInvestigationId}`);
    
    // In a real implementation, this would trigger the investigation system
    // For now, just return a mock response
    return { investigation_id: newInvestigationId };
  },

  // Get investigation status (useful for polling running investigations)
  getInvestigationStatus: async (investigationId: string): Promise<{ 
    status: InvestigationStatus, 
    cycle_id: number,
    evidence_count: number,
    analysis_count: number 
  } | null> => {
    await delay(300);
    console.log(`Mock API: Fetching status for investigation ${investigationId}`);
    
    const investigation = mockInvestigations.find(
      inv => inv.investigation_id === investigationId
    );
    
    if (!investigation) return null;
    
    return {
      status: investigation.status,
      cycle_id: investigation.cycle_id,
      evidence_count: investigation.processed_evidence?.length || 0,
      analysis_count: investigation.new_analysis?.length || 0
    };
  },

  // Get investigation graph data
  getInvestigationGraph: async (investigationId: string) => {
    await delay(400);
    console.log(`Mock API: Fetching graph data for investigation ${investigationId}`);
    
    const investigation = mockInvestigations.find(
      inv => inv.investigation_id === investigationId
    );
    
    return investigation?.graph_context || null;
  },

  // Search investigations by query or entity
  searchInvestigations: async (searchTerm: string): Promise<Investigation[]> => {
    await delay(600);
    console.log(`Mock API: Searching investigations for: ${searchTerm}`);
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    
    return mockInvestigations.filter(investigation => 
      investigation.initial_query.toLowerCase().includes(lowerSearchTerm) ||
      investigation.investigated_entities?.some(entity => 
        entity.toLowerCase().includes(lowerSearchTerm)
      ) ||
      investigation.vip_targets?.some(target =>
        target.toLowerCase().includes(lowerSearchTerm)
      )
    );
  },

  // Get recent investigations (last N investigations)
  getRecentInvestigations: async (limit: number = 10): Promise<Investigation[]> => {
    await delay(400);
    console.log(`Mock API: Fetching ${limit} most recent investigations`);
    
    return mockInvestigations
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      .slice(0, limit);
  },

  // Get investigations by status
  getInvestigationsByStatus: async (status: InvestigationStatus): Promise<Investigation[]> => {
    await delay(500);
    console.log(`Mock API: Fetching investigations with status: ${status}`);
    
    return mockInvestigations.filter(inv => inv.status === status);
  },

  // Get investigations by threat level
  getInvestigationsByThreatLevel: async (threatLevel: ThreatLevel): Promise<Investigation[]> => {
    await delay(500);
    console.log(`Mock API: Fetching investigations with threat level: ${threatLevel}`);
    
    return mockInvestigations.filter(inv => 
      inv.final_conclusion?.threat_assessment.threat_level === threatLevel
    );
  },

  // Get investigation statistics
  getInvestigationStats: async (): Promise<{
    total: number;
    by_status: Record<InvestigationStatus, number>;
    by_threat_level: Record<ThreatLevel, number>;
    average_trust_score: number;
    total_evidence: number;
  }> => {
    await delay(300);
    console.log("Mock API: Fetching investigation statistics");
    
    const stats = {
      total: mockInvestigations.length,
      by_status: {
        [InvestigationStatus.RUNNING]: 0,
        [InvestigationStatus.COMPLETED]: 0,
        [InvestigationStatus.FAILED]: 0
      } as Record<InvestigationStatus, number>,
      by_threat_level: {
        [ThreatLevel.LOW]: 0,
        [ThreatLevel.MODERATE]: 0,
        [ThreatLevel.HIGH]: 0,
        [ThreatLevel.CRITICAL]: 0
      } as Record<ThreatLevel, number>,
      average_trust_score: 0,
      total_evidence: 0
    };

    let totalTrustScore = 0;
    let trustScoreCount = 0;

    mockInvestigations.forEach(inv => {
      // Count by status
      stats.by_status[inv.status]++;
      
      // Count by threat level
      if (inv.final_conclusion?.threat_assessment.threat_level) {
        stats.by_threat_level[inv.final_conclusion.threat_assessment.threat_level]++;
      }
      
      // Sum trust scores
      if (inv.final_conclusion?.threat_assessment.average_trust_score) {
        totalTrustScore += inv.final_conclusion.threat_assessment.average_trust_score;
        trustScoreCount++;
      }
      
      // Count evidence
      stats.total_evidence += inv.processed_evidence?.length || 0;
    });

    if (trustScoreCount > 0) {
      stats.average_trust_score = totalTrustScore / trustScoreCount;
    }

    return stats;
  }
};