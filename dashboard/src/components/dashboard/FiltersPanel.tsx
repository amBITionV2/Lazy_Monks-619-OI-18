import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FilterState } from '@/types/dashboard';
import { SlidersHorizontal } from 'lucide-react';
import { hazardTypeMapping, HazardType } from '@/lib/hazard-mappings';

interface FiltersPanelProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

const hazardTypes = Object.keys(hazardTypeMapping) as Array<keyof typeof hazardTypeMapping>;
const sources = ['Citizen App', 'Social Media', 'Official Agency', 'Ship Sensor'];
const statuses = ['Verified', 'Unverified', 'Dismissed', 'Approved'];

const FiltersPanel = ({ filters, onFilterChange }: FiltersPanelProps) => {
  const handleCheckboxChange = (category: keyof FilterState, value: string, checked: boolean) => {
    const currentValues = filters[category] as string[];
    const newValues = checked
      ? [...currentValues, value]
      : currentValues.filter(v => v !== value);
    onFilterChange({ ...filters, [category]: newValues });
  };

  return (
    <Card className="w-full h-full border shadow-md flex flex-col overflow-hidden rounded-2xl">
      
      {/* Header */}
      <div className="p-4 border-b flex-shrink-0 rounded-t-2xl">
        <div className="flex items-center space-x-2">
          <SlidersHorizontal className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-blue-900">Hazard Filters</h2>
        </div>
        <p className="text-xs text-blue-800/70 mt-1">Refine reports with custom filters</p>
      </div>

      {/* Scrollable Content */}
      <ScrollArea className="flex-1 px-4">
        <div className="space-y-6 py-4">
          
          <FilterGroup title="Time Range">
            <Select 
              value={filters.timeRange} 
              onValueChange={(value: string) => onFilterChange({ ...filters, timeRange: value as FilterState['timeRange'] })}
            >
              <SelectTrigger className="hover:border-blue-500 focus:ring-blue-400 focus:ring-1 rounded-md transition-all">
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent className="bg-white border-blue-200 shadow-lg rounded-md">
                <SelectItem value="Last 1 Hour">Last 1 Hour</SelectItem>
                <SelectItem value="Last 6 Hours">Last 6 Hours</SelectItem>
                <SelectItem value="Today">Today</SelectItem>
                <SelectItem value="Last 7 Days">Last 7 Days</SelectItem>
              </SelectContent>
            </Select>
          </FilterGroup>

          <FilterGroup title="Hazard Type">
            <div className="space-y-2 max-h-32 overflow-y-auto custom-scrollbar pr-1">
              {hazardTypes.map(type => (
                <CheckboxItem 
                  key={type} 
                  id={`hazard-${type}`} 
                  label={hazardTypeMapping[type as HazardType]} 
                  checked={filters.hazardTypes.includes(type)} 
                  onCheckedChange={(c) => handleCheckboxChange('hazardTypes', type, c)} 
                />
              ))}
            </div>
          </FilterGroup>

          <FilterGroup title="Source">
            <div className="space-y-2">
              {sources.map(source => (
                <CheckboxItem 
                  key={source} 
                  id={`source-${source}`} 
                  label={source} 
                  checked={filters.sources.includes(source)} 
                  onCheckedChange={(c) => handleCheckboxChange('sources', source, c)} 
                />
              ))}
            </div>
          </FilterGroup>

          <FilterGroup title="Status">
            <div className="space-y-2">
              {statuses.map(status => (
                <CheckboxItem 
                  key={status} 
                  id={`status-${status}`} 
                  label={status} 
                  checked={filters.statuses.includes(status)} 
                  onCheckedChange={(c) => handleCheckboxChange('statuses', status, c)} 
                />
              ))}
            </div>
          </FilterGroup>

          <FilterGroup title="Confidence Score">
            <div className="px-1 pt-2 pb-2">
              <Slider
                value={filters.confidenceRange}
                onValueChange={(value: [number, number]) =>
                  onFilterChange({
                    ...filters,
                    confidenceRange: value as [number, number],
                  })
                }
                min={0}
                max={100}
                step={1}
                className="w-full h-2 rounded-lg
                  [&_[data-orientation=horizontal]>span:first-child]:bg-gradient-to-r
                  [&_[data-orientation=horizontal]>span:first-child]:from-blue-400
                  [&_[data-orientation=horizontal]>span:first-child]:via-teal-400
                  [&_[data-orientation=horizontal]>span:first-child]:to-green-400
                  [&>span>span>span]:bg-blue-700"
              />
              <div className="flex justify-between text-xs text-blue-900 mt-2 font-mono">
                <span>{filters.confidenceRange[0]}%</span>
                <span>{filters.confidenceRange[1]}%</span>
              </div>
            </div>
          </FilterGroup>


        </div>
      </ScrollArea>
    </Card>
  );
};

// Helper components
const FilterGroup = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="space-y-3 border-t pt-4 first:border-t-0 first:pt-0">
    <h3 className="text-sm font-semibold text-blue-900 flex items-center">{title}</h3>
    <div className="space-y-2">{children}</div>
  </div>
);

const CheckboxItem = ({ id, label, checked, onCheckedChange }: { id: string, label: string, checked: boolean, onCheckedChange: (checked: boolean) => void }) => (
  <div className="flex items-center space-x-3 group px-2 py-1 rounded-md hover:bg-blue-100/30 transition-all cursor-pointer">
    <Checkbox 
      id={id} 
      checked={checked} 
      onCheckedChange={(c: boolean) => onCheckedChange(c as boolean)} 
      className="data-[state=checked]:bg-blue-500 data-[state=checked]:text-white border-blue-300 data-[state=checked]:border-blue-500" 
    />
    <label 
      htmlFor={id} 
      className="text-sm text-blue-900/80 cursor-pointer hover:text-blue-900 transition-colors group-hover:text-blue-900 flex-1"
    >
      {label}
    </label>
  </div>
);

export default FiltersPanel;
