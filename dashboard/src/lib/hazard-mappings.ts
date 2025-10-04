import { HazardReport } from '@/types/dashboard';
import { Waves, Droplets, Zap, AlertTriangle, Wind, HelpCircle } from 'lucide-react';
import React from 'react';

export type HazardType = 'HIGH_WAVES' | 'SWELL_SURGE' | 'COASTAL_FLOODING' | 'UNUSUAL_TIDE' | 'TSUNAMI_SIGHTING' | 'OTHER' | 'Cyclone' | 'Erosion' | 'Storm Surge';


export const hazardTypeMapping: Record<HazardReport['type'], string> = {
  HIGH_WAVES: 'High Waves',
  SWELL_SURGE: 'Swell Surge',
  COASTAL_FLOODING: 'Coastal Flooding',
  UNUSUAL_TIDE: 'Unusual Tide',
  TSUNAMI_SIGHTING: 'Tsunami Sighting',
  OTHER: 'Other',
  // Adding previous mock types for compatibility, can be removed later
  'Cyclone': 'Cyclone',
  'Erosion': 'Erosion',
  'Storm Surge': 'Storm Surge',
  'High Waves': 'High Waves',
  'Coastal Flooding': 'Coastal Flooding',
  'Tsunami Warning': 'Tsunami Warning',
};

export const getHazardIcon = (type: HazardReport['type']) => {
    const base = "h-5 w-5 flex-shrink-0";
    switch (type) {
      case 'HIGH_WAVES':
      case 'High Waves':
        return React.createElement(Waves, { className: `${base} text-cyan-500` });
      case 'SWELL_SURGE':
      case 'Storm Surge':
        return React.createElement(Zap, { className: `${base} text-yellow-500` });
      case 'COASTAL_FLOODING':
      case 'Coastal Flooding':
        return React.createElement(Droplets, { className: `${base} text-blue-500` });
      case 'UNUSUAL_TIDE':
        return React.createElement(AlertTriangle, { className: `${base} text-orange-500` });
      case 'TSUNAMI_SIGHTING':
      case 'Tsunami Warning':
        return React.createElement(AlertTriangle, { className: `${base} text-red-500` });
       case 'Cyclone':
        return React.createElement(Wind, { className: `${base} text-indigo-500` });
       case 'Erosion':
        return React.createElement(AlertTriangle, { className: `${base} text-emerald-600` });
      case 'OTHER':
        return React.createElement(HelpCircle, { className: `${base} text-gray-500` });
      default:
        return React.createElement(AlertTriangle, { className: `${base} text-gray-500` });
    }
};
