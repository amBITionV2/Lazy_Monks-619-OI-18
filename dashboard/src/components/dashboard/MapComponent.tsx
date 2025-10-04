import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { HazardReport } from '@/types/dashboard';
import L from "leaflet";

interface MapComponentProps {
  reports: HazardReport[];
  selectedReport?: HazardReport | null;
  onReportSelect: (report: HazardReport) => void;
}
const centerOfIndia: [number, number] = [20.5937, 78.9629]; // Centre of India

// 🟢 Custom marker based on status
const getCustomMarker = (status: HazardReport['status']) => {
  let color = "orange"; // default
  if (status === "Verified") color = "green";
  else if (status === "Unverified") color = "yellow";
  else if (status === "Approved") color = "blue";
  else if (status === "Dismissed") color = "gray";

  return L.divIcon({
    className: "",
    html: `<div style="
      background-color:${color};
      width:18px;
      height:18px;
      border-radius:50%;
      border:2px solid white;
      box-shadow:0 0 6px rgba(0,0,0,0.4);
    "></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
};

const formatTimeAgo = (timestamp: Date) => {
  const diff = Date.now() - new Date(timestamp).getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (minutes < 60) return `${minutes} mins ago`;
  return `${hours} hours ago`;
};

const MapComponent = ({
  reports,
  selectedReport,
  onReportSelect
}: MapComponentProps) => {
  return (
    <div className="relative h-full w-full rounded-lg overflow-hidden shadow-ocean">
      <MapContainer
        center={centerOfIndia}
        zoom={5}
        scrollWheelZoom={true}
        className="h-[80vh] w-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {reports.map(report => (
          <Marker
            key={report.id}
            position={[report.location.lat, report.location.lng]}
            icon={getCustomMarker(report.status)}  // ✅ custom marker applied
            eventHandlers={{ click: () => onReportSelect(report) }}
          >
            <Popup>
              <div>
                {report.imageUrl && <img src={report.imageUrl} alt="Hazard" className="w-full h-auto rounded-md mb-2" />}
                <div className="font-semibold text-base">{report.type}</div>
                <div className="mt-1 text-xs text-gray-500">{report.location.name}</div>
                <div className="mt-1 text-sm">{report.description}</div>
                <div className="mt-2 flex justify-between text-xs text-gray-400">
                  <span>{formatTimeAgo(report.timestamp)}</span>
                  <span>{report.confidence}% confidence</span>
                </div>
                <div className="mt-2">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium
                      ${report.status === 'Verified' ? 'bg-green-100 text-green-800'
                        : report.status === 'Unverified' ? 'bg-yellow-100 text-yellow-800'
                        : report.status === 'Dismissed' ? 'bg-gray-200 text-gray-700'
                        : report.status === 'Approved' ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                    {report.status}
                  </span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Status Legend */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-card/90 backdrop-blur-sm rounded-lg p-3 border border-border">
        <h4 className="text-sm font-semibold mb-2 text-card-foreground">Status Legend</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-600 rounded-full"></div>
            <span>Verified</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>Unverified</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Approved</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
            <span>Dismissed</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapComponent;