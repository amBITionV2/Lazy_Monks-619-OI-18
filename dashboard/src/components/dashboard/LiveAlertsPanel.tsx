import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CheckCircle, X, ArrowUp, MapPin, Clock, User, BarChart, ChevronLeft, ExternalLink, Twitter, Instagram
} from 'lucide-react';
import { HazardReport, SocialPost } from '@/types/dashboard';
import { hazardTypeMapping, getHazardIcon } from '@/lib/hazard-mappings';

type SelectedItem = HazardReport | SocialPost | null;

interface LiveAlertsPanelProps {
  reports: HazardReport[];
  socialPosts: SocialPost[];
  selectedItem: SelectedItem;
  onSelectItem: (item: SelectedItem) => void;
  onReportAction: (reportId: string, action: 'verify' | 'dismiss' | 'escalate') => void;
}

const LiveAlertsPanel = ({ reports, socialPosts, selectedItem, onSelectItem, onReportAction }: LiveAlertsPanelProps) => {
  const [activeTab, setActiveTab] = useState("citizen");

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    onSelectItem(null); // Clear selection when switching tabs
  };

  if (selectedItem) {
    if ('location' in selectedItem) { // It's a HazardReport
      return <ReportDetail report={selectedItem} onBack={() => onSelectItem(null)} onReportAction={onReportAction} />;
    }
    if ('sourcePlatform' in selectedItem) { // It's a SocialPost
        return <SocialPostDetail post={selectedItem} onBack={() => onSelectItem(null)} />;
    }
  }

  // Main List View
  return (
    <Card className="w-full h-full bg-sidebar border-sidebar-border flex flex-col overflow-hidden">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="flex flex-col h-full">
        <div className="p-4 border-b border-sidebar-border flex-shrink-0">
            <h2 className="text-lg font-semibold text-blue-900 text-sidebar-foreground mb-3">Live Feed</h2>
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="citizen">Citizen Reports</TabsTrigger>
                <TabsTrigger value="social">Social Media</TabsTrigger>
            </TabsList>
        </div>
        
        <TabsContent value="citizen" className="flex-1 overflow-hidden m-0">
            <ScrollArea className="h-full">
                <div className="p-3 space-y-2">
                    {reports.length === 0 ? <EmptyState message="No reports match filters"/> : reports.map((report) => (
                        <ReportCard key={report.id} report={report} onClick={() => onSelectItem(report)} />
                    ))}
                </div>
            </ScrollArea>
        </TabsContent>

        <TabsContent value="social" className="flex-1 overflow-hidden m-0">
            <ScrollArea className="h-full">
                <div className="p-3 space-y-2">
                    {socialPosts.length === 0 ? <EmptyState message="No social posts found"/> : socialPosts.map((post) => (
                        <SocialPostCard key={post.id} post={post} onClick={() => onSelectItem(post)} />
                    ))}
                </div>
            </ScrollArea>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

// ... (Helper Components: getStatusBadge, formatTimeAgo)
const getStatusBadge = (status: HazardReport['status'] | SocialPost['status']) => {
    const variants: { [key: string]: string } = {
      Verified: "bg-green-100 text-green-700 border-green-300",
      Unverified: "bg-yellow-100 text-yellow-700 border-yellow-300",
      Approved: "bg-blue-100 text-blue-700 border-blue-300",
      Dismissed: "bg-gray-200 text-gray-700 border-gray-400",
      PENDING: "bg-yellow-100 text-yellow-700 border-yellow-300",
      PROCESSED: "bg-green-100 text-green-700 border-green-300",
      DISCARDED: "bg-gray-200 text-gray-700 border-gray-400",
    };
    return <Badge variant="outline" className={`text-xs font-medium ${variants[status] || ""}`}>{status}</Badge>;
};
const formatTimeAgo = (timestamp: Date) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
};


// Report Detail View
const ReportDetail = ({ report, onBack, onReportAction }: { report: HazardReport, onBack: () => void, onReportAction: LiveAlertsPanelProps['onReportAction'] }) => (
    <Card className="w-full h-full bg-sidebar border-sidebar-border flex flex-col overflow-hidden">
        <div className="p-4 border-b border-sidebar-border">
            <div className="flex items-center justify-between mb-3"><h2 className="text-lg font-semibold text-sidebar-foreground">Report Details</h2><Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8 text-sidebar-foreground hover:bg-cyan-100"><ChevronLeft className="h-4 w-4" /></Button></div>
            <div className="flex items-start space-x-3"><div className="mt-0.5">{getHazardIcon(report.type)}</div><div className="flex-1 min-w-0"><h3 className="font-medium text-sidebar-foreground text-base mb-2">{hazardTypeMapping[report.type]}</h3>{getStatusBadge(report.status)}</div></div>
        </div>
        <ScrollArea className="flex-1 px-4"><div className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
                <InfoItem icon={<MapPin className="h-4 w-4" />} label="Location" value={report.location.name} />
                <InfoItem icon={<Clock className="h-4 w-4" />} label="Reported" value={formatTimeAgo(report.timestamp)} />
                <InfoItem icon={<User className="h-4 w-4" />} label="Source" value={report.source} />
                <InfoItem icon={<BarChart className="h-4 w-4" />} label="Confidence" value={`${report.confidence}%`} />
            </div>
            {report.imageUrl && <DetailSection title="Media"><img src={report.imageUrl} alt="Hazard Media" className="rounded-lg w-full" /></DetailSection>}
            <DetailSection title="Description"><p className="text-sm text-muted-foreground leading-relaxed">{report.description}</p></DetailSection>
            <DetailSection title="Coordinates"><div className="bg-sidebar-accent rounded-lg p-3 border border-sidebar-border"><div className="grid grid-cols-2 gap-3 text-sm font-mono"><div><span className="text-muted-foreground">Lat:</span><span className="ml-2 text-sidebar-foreground">{report.location.lat.toFixed(6)}</span></div><div><span className="text-muted-foreground">Lng:</span><span className="ml-2 text-sidebar-foreground">{report.location.lng.toFixed(6)}</span></div></div></div></DetailSection>
        </div></ScrollArea>
        <div className="p-4 border-t border-sidebar-border flex-shrink-0 bg-sidebar-accent/30"><div className="grid grid-cols-3 gap-2">
            <Button size="sm" onClick={() => onReportAction(report.id, 'verify')} className="bg-green-600 hover:bg-green-700 text-white"><CheckCircle className="h-3.5 w-3.5 mr-1.5" />Verify</Button>
            <Button size="sm" variant="outline" onClick={() => onReportAction(report.id, 'dismiss')} className="border-gray-300 text-gray-600 hover:bg-gray-100"><X className="h-3.5 w-3.5 mr-1.5" />Dismiss</Button>
            <Button size="sm" onClick={() => onReportAction(report.id, 'escalate')} className="bg-red-600 hover:bg-red-700 text-white"><ArrowUp className="h-3.5 w-3.5 mr-1.5" />Escalate</Button>
        </div></div>
    </Card>
);

// Social Post Detail View
const SocialPostDetail = ({ post, onBack }: { post: SocialPost, onBack: () => void }) => (
    <Card className="w-full h-full bg-sidebar border-sidebar-border flex flex-col overflow-hidden">
        <div className="p-4 border-b border-sidebar-border">
            <div className="flex items-center justify-between mb-3"><h2 className="text-lg font-semibold text-sidebar-foreground">Social Post Details</h2><Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8 text-sidebar-foreground hover:bg-cyan-100"><ChevronLeft className="h-4 w-4" /></Button></div>
            <div className="flex items-start space-x-3"><div className="mt-0.5">{getSocialIcon(post.sourcePlatform)}</div><div className="flex-1 min-w-0"><h3 className="font-medium text-sidebar-foreground text-base mb-2">{post.authorId || 'Unknown Author'}</h3>{getStatusBadge(post.status)}</div></div>
        </div>
        <ScrollArea className="flex-1 px-4"><div className="space-y-6 py-4">
            {post.imageUrl && <DetailSection title="Media"><img src={post.imageUrl} alt="Social Media Post" className="rounded-lg w-full" /></DetailSection>}
            <DetailSection title="Content"><p className="text-sm text-muted-foreground leading-relaxed">{post.contentText}</p></DetailSection>
            <div className="grid grid-cols-2 gap-4 text-sm">
                <InfoItem icon={<Clock className="h-4 w-4" />} label="Posted" value={formatTimeAgo(post.postedAt)} />
                <InfoItem icon={<User className="h-4 w-4" />} label="Platform" value={post.sourcePlatform} />
            </div>
            <a href={post.postUrl} target="_blank" rel="noopener noreferrer" className="w-full"><Button size="sm" className="w-full"><ExternalLink className="h-3.5 w-3.5 mr-1.5"/>View Original Post</Button></a>
        </div></ScrollArea>
    </Card>
);

// Cards for List Views
const ReportCard = ({ report, onClick }: { report: HazardReport; onClick: () => void; }) => (
  <div onClick={onClick} className="bg-sidebar-accent border border-transparent rounded-lg p-3 cursor-pointer hover:border-cyan-400 hover:bg-cyan-50/40 transition-all group">
    <div className="flex items-start space-x-3"><div className="mt-1 group-hover:scale-110 transition-transform">{getHazardIcon(report.type)}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between mb-2 gap-2"><h3 className="text-sm font-medium text-sidebar-foreground truncate pr-2">{hazardTypeMapping[report.type]}</h3>{getStatusBadge(report.status)}</div>
        <p className="text-xs text-muted-foreground mb-2 truncate"><MapPin className="h-3 w-3 inline mr-1" />{report.location.name}</p>
        <div className="flex items-center justify-between text-xs"><span className="text-muted-foreground flex items-center"><Clock className="h-3 w-3 mr-1" />{formatTimeAgo(report.timestamp)}</span><span className="font-mono text-muted-foreground bg-sidebar/50 px-2 py-0.5 rounded">{report.source}</span></div>
        <div className="mt-2 flex items-center justify-between"><div className="text-xs text-muted-foreground">Confidence: <span className="font-medium text-sidebar-foreground">{report.confidence}%</span></div><div className="text-xs text-cyan-600 opacity-0 group-hover:opacity-100">Click for details →</div></div>
      </div>
    </div>
  </div>
);

const getSocialIcon = (platform: SocialPost['sourcePlatform']) => {
    const base = "h-5 w-5 flex-shrink-0";
    switch(platform) {
        case 'X':
        case 'TWITTER':
            return <Twitter className={`${base} text-sky-500`} />;
        case 'INSTAGRAM':
            return <Instagram className={`${base} text-pink-500`} />;
        default:
            return <User className={`${base} text-gray-500`} />;
    }
};

const SocialPostCard = ({ post, onClick }: { post: SocialPost; onClick: () => void; }) => (
    <div onClick={onClick} className="bg-sidebar-accent border border-transparent rounded-lg p-3 cursor-pointer hover:border-cyan-400 hover:bg-cyan-50/40 transition-all group">
        <div className="flex items-start space-x-3"><div className="mt-1 group-hover:scale-110 transition-transform">{getSocialIcon(post.sourcePlatform)}</div>
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2 gap-2"><h3 className="text-sm font-medium text-sidebar-foreground truncate pr-2">{post.authorId || 'Unknown'}</h3>{getStatusBadge(post.status)}</div>
                <p className="text-xs text-muted-foreground mb-2 truncate">{post.contentText}</p>
                <div className="flex items-center justify-between text-xs"><span className="text-muted-foreground flex items-center"><Clock className="h-3 w-3 mr-1" />{formatTimeAgo(post.postedAt)}</span><div className="text-xs text-cyan-600 opacity-0 group-hover:opacity-100">Click for details →</div></div>
            </div>
        </div>
    </div>
);

// Helper Components
const EmptyState = ({ message }: { message: string }) => (<div className="flex flex-col items-center justify-center py-12 text-center"><p className="text-muted-foreground">{message}</p></div>);
const DetailSection = ({ title, children }: { title: string, children: React.ReactNode }) => (<div className="space-y-2"><h4 className="text-sm font-semibold text-sidebar-foreground border-b border-sidebar-border/30 pb-1">{title}</h4>{children}</div>);
const InfoItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (<div className="flex items-start space-x-2 p-2 bg-sidebar-accent/50 rounded-md"><div className="text-muted-foreground mt-0.5 flex-shrink-0">{icon}</div><div className="min-w-0 flex-1"><div className="text-xs text-muted-foreground uppercase tracking-wide">{label}</div><div className="text-sidebar-foreground font-medium text-sm truncate" title={value}>{value}</div></div></div>);

export default LiveAlertsPanel;