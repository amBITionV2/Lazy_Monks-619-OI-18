import { HazardReport, DashboardStats } from '@/types/dashboard';

// Mock data for dashboard - replace with Supabase queries in production
export const mockStats: DashboardStats = {
  totalReports: 1258,
  verifiedEvents: 881,
  reportsLastHour: 41,
  activeAlerts: 9,
};

export const mockReports: HazardReport[] = [
  {
    id: '1',
    type: 'High Waves',
    severity: 'High',
    status: 'Verified',
    source: 'Ship Sensor',
    location: {
      lat: 19.0760,
      lng: 72.8777,
      name: 'Mumbai Coast'
    },
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    description: 'High wave activity detected near Mumbai coastline',
    confidence: 92,
    reportedBy: 'Ship Sensor Network',
    aiAnalysis: {
      confidence: 92,
      tags: ['high-waves', 'Mumbai', 'ship-sensor'],
      risk_level: 'high'
    }
  },
  {
    id: '2',
    type: 'Coastal Flooding',
    severity: 'Medium',
    status: 'Approved', // Changed status to 'Approved'
    source: 'Citizen App',
    location: {
      lat: 11.2588, // Corrected coordinates for Kozhikode (Calicut) coast
      lng: 75.7804,
      name: 'Kozhikode Beach'
    },
    timestamp: new Date(Date.now() - 25 * 60 * 1000), // 25 minutes ago
    description: 'Coastal flooding reported by local residents, confirmed by authorities.',
    confidence: 85,
    reportedBy: 'Local Resident',
    imageUrl: '/api/placeholder/300/200'
  },
  {
    id: '3',
    type: 'Storm Surge',
    severity: 'High',
    status: 'Verified',
    source: 'Official Agency',
    location: {
      lat: 13.0827,
      lng: 80.2707,
      name: 'Chennai Harbor'
    },
    timestamp: new Date(Date.now() - 36 * 60 * 1000), // 36 minutes ago
    description: 'Storm surge warning issued by meteorological department',
    confidence: 95,
    reportedBy: 'IMD Chennai'
  },
  {
    id: '4',
    type: 'Erosion',
    severity: 'Medium',
    status: 'Dismissed', // Changed status to 'Dismissed'
    source: 'Social Media',
    location: {
      lat: 15.2993,
      lng: 74.1240,
      name: 'Goa Coastline'
    },
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    description: 'Beach erosion reported on social media. Analysis showed it was old footage.',
    confidence: 45, // Lowered confidence
    reportedBy: 'Social Media User'
  },
  {
    id: '5',
    type: 'High Waves',
    severity: 'High',
    status: 'Verified',
    source: 'Ship Sensor',
    location: {
      lat: 8.5241,
      lng: 76.9366,
      name: 'Trivandrum Coast'
    },
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    description: 'High waves detected by monitoring stations',
    confidence: 89,
    reportedBy: 'INCOIS'
  },
  {
    id: '6',
    type: 'Cyclone',
    severity: 'Critical',
    status: 'Verified',
    source: 'Official Agency',
    location: {
      lat: 17.6868,
      lng: 83.2185,
      name: 'Visakhapatnam'
    },
    timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000), // 10 hours ago (Today)
    description: 'Cyclone formation detected in Bay of Bengal',
    confidence: 98,
    reportedBy: 'Cyclone Warning Centre'
  },
  // --- New Data Points for Comprehensive Filtering ---
  {
    id: '7',
    type: 'Tsunami Warning', // New Hazard Type
    severity: 'Critical',
    status: 'Verified',
    source: 'Official Agency',
    location: {
      lat: 11.6234, // New Location
      lng: 92.7265,
      name: 'Port Blair, Andaman'
    },
    timestamp: new Date(Date.now() - 50 * 60 * 1000), // 50 minutes ago
    description: 'Tsunami warning issued following a seismic event in the region.',
    confidence: 99,
    reportedBy: 'Indian Tsunami Early Warning Centre'
  },
  {
    id: '8',
    type: 'Coastal Flooding',
    severity: 'Low',
    status: 'Unverified',
    source: 'Social Media',
    location: {
      lat: 19.8118, // New Location
      lng: 85.8312,
      name: 'Puri Beach, Odisha'
    },
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    description: 'Minor coastal flooding reported on Twitter near Puri temple.',
    confidence: 65,
    reportedBy: 'Social Media User',
    imageUrl: '/api/placeholder/300/200'
  },
  {
    id: '9',
    type: 'Erosion',
    severity: 'Medium',
    status: 'Approved', // New Status
    source: 'Citizen App',
    location: {
        lat: 8.0883, // New Location
        lng: 77.5385,
        name: 'Kanyakumari'
    },
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    description: 'Citizen report of significant erosion near Vivekananda Rock Memorial.',
    confidence: 78,
    reportedBy: 'Local Guide',
    aiAnalysis: {
        confidence: 82,
        tags: ['erosion', 'Kanyakumari', 'citizen-report'],
        risk_level: 'medium'
    }
  },
  {
    id: '10',
    type: 'Storm Surge',
    severity: 'High',
    status: 'Unverified',
    source: 'Ship Sensor',
    location: {
      lat: 21.6257, // New Location
      lng: 87.5348,
      name: 'Digha, West Bengal'
    },
    timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
    description: 'Potential storm surge conditions detected by offshore sensors.',
    confidence: 72,
    reportedBy: 'Offshore Sensor #1138'
  }
];

// Function to simulate real-time updates - updated with new options
export const generateMockReport = (): HazardReport => {
  const types: HazardReport['type'][] = ['High Waves', 'Coastal Flooding', 'Cyclone', 'Storm Surge', 'Erosion', 'Tsunami Warning'];
  const sources: HazardReport['source'][] = ['Citizen App', 'Social Media', 'Official Agency', 'Ship Sensor'];
  const statuses: HazardReport['status'][] = ['Verified', 'Unverified', 'Approved', 'Dismissed'];
  const severities: HazardReport['severity'][] = ['Low', 'Medium', 'High', 'Critical'];
  const locations = [
    { lat: 19.0760, lng: 72.8777, name: 'Mumbai Coast' },
    { lat: 11.2588, lng: 75.7804, name: 'Kozhikode Beach' },
    { lat: 13.0827, lng: 80.2707, name: 'Chennai Harbor' },
    { lat: 15.2993, lng: 74.1240, name: 'Goa Coastline' },
    { lat: 11.6234, lng: 92.7265, name: 'Port Blair, Andaman' },
    { lat: 19.8118, lng: 85.8312, name: 'Puri Beach, Odisha' },
    { lat: 8.0883, lng: 77.5385, name: 'Kanyakumari' },
  ];

  return {
    id: Math.random().toString(36).substr(2, 9),
    type: types[Math.floor(Math.random() * types.length)],
    severity: severities[Math.floor(Math.random() * severities.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    source: sources[Math.floor(Math.random() * sources.length)],
    location: locations[Math.floor(Math.random() * locations.length)],
    timestamp: new Date(),
    description: 'Automatically generated hazard report for testing',
    confidence: Math.floor(Math.random() * 60) + 40, // Confidence between 40-100
    reportedBy: 'System Generated',
  };
};