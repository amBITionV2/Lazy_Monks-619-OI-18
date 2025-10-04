"use client";
import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import FiltersPanel from "@/components/dashboard/FiltersPanel";
import LiveAlertsPanel from "@/components/dashboard/LiveAlertsPanel";
import { DashboardStats, HazardReport, FilterState, SocialPost } from "@/types/dashboard";
import { useAuth } from "@/context/AuthContext";
import { createClient } from '@/utils/supabase/client';
import ClientOnly from "@/components/ClientOnly";

const MapComponent = dynamic(() => import("@/components/dashboard/MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full rounded-lg bg-card border border-border flex items-center justify-center">
      <div className="text-muted">Loading map...</div>
    </div>
  ),
});

type SelectedItem = HazardReport | SocialPost | null;

const Dashboard = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState<HazardReport[]>([]);
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>([]);
  const [selectedItem, setSelectedItem] = useState<SelectedItem>(null);
  const [filters, setFilters] = useState<FilterState>({
    timeRange: "Today",
    hazardTypes: [],
    sources: [],
    statuses: [],
    confidenceRange: [0, 100],
  });
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      // Fetch Citizen Reports
      const { data: reportsData, error: reportsError } = await supabase
        .from('citizen_reports')
        .select(`
          id, hazard_type, description, location, media_urls, created_at, event_id,
          events ( status, confidence_score )
        `);

      if (reportsError) {
        console.error('Error fetching reports:', reportsError);
      } else if (reportsData) {
        const transformedReports = reportsData.map((report: any) => {
            const coordinates = report.location?.coordinates;
            if (!coordinates || !Array.isArray(coordinates) || coordinates.length < 2 || typeof coordinates[1] !== 'number' || typeof coordinates[0] !== 'number') {
              console.warn(`Report ${report.id} has invalid or missing location data and will be skipped.`);
              return null;
            }
            const longitude = coordinates[0];
            const latitude = coordinates[1];
            const mediaUrl = report.media_urls && report.media_urls.length > 0 ? report.media_urls[0] : null;
            const fullMediaUrl = mediaUrl ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${mediaUrl}` : undefined;
            
            // Log for debugging
            if(fullMediaUrl) {
              console.log(`[Citizen Report Media] ID: ${report.id}, URL: ${fullMediaUrl}`);
            }

            const locationName = `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`;
            return {
                id: report.id, type: report.hazard_type, description: report.description,
                location: { lat: latitude, lng: longitude, name: locationName },
                imageUrl: fullMediaUrl, timestamp: new Date(report.created_at),
                status: report.events?.status || 'Unverified',
                confidence: report.events?.confidence_score || 50,
                source: 'Citizen App', severity: 'Medium', reportedBy: 'Citizen', event_id: report.event_id,
            };
        }).filter(Boolean) as HazardReport[];
        setReports(transformedReports);
      }

      // Fetch Social Posts
      const { data: postsData, error: postsError } = await supabase
        .from('social_posts')
        .select('*')
        .order('posted_at', { ascending: false })
        .limit(50);

      if (postsError) {
        console.error('Error fetching social posts:', postsError);
      } else if (postsData) {
        const transformedPosts: SocialPost[] = postsData.map((post: any) => {
           const mediaUrl = post.media_urls && post.media_urls.length > 0 ? post.media_urls[0] : null;
           // For social media posts, the media_urls are likely direct, absolute URLs.
           const fullMediaUrl = mediaUrl;

           // Log the URL for debugging purposes, as requested.
           if(fullMediaUrl) {
            console.log(`[Social Post Media] ID: ${post.id}, URL: ${fullMediaUrl}`);
           }

           return {
            id: post.id,
            sourcePlatform: post.source_platform,
            authorId: post.author_id,
            contentText: post.content_text,
            postedAt: new Date(post.posted_at),
            postUrl: post.post_url,
            imageUrl: fullMediaUrl,
            status: post.status,
          }
        });
        setSocialPosts(transformedPosts);
      }
    };

    fetchData();
  }, [supabase]);

  const filteredReports = useMemo(
    () =>
      reports.filter((report) => {
        const now = new Date();
        let timeThreshold = now;
        switch (filters.timeRange) {
          case "Last 1 Hour":
            timeThreshold = new Date(now.getTime() - 60 * 60 * 1000);
            break;
          case "Last 6 Hours":
            timeThreshold = new Date(now.getTime() - 6 * 60 * 60 * 1000);
            break;
          case "Today":
            timeThreshold = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            break;
          case "Last 7 Days":
            timeThreshold = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
        }
        if (new Date(report.timestamp) < timeThreshold) return false;
        if (filters.hazardTypes.length > 0 && !filters.hazardTypes.includes(report.type)) return false;
        if (filters.sources.length > 0 && !filters.sources.includes(report.source)) return false;
        if (filters.statuses.length > 0 && !filters.statuses.includes(report.status)) return false;
        if (report.confidence < filters.confidenceRange[0] || report.confidence > filters.confidenceRange[1])
          return false;
        return true;
      }),
    [reports, filters]
  );

  const handleReportAction = async (reportId: string, action: "verify" | "dismiss" | "escalate") => {
    const reportToUpdate = reports.find(r => r.id === reportId);
    if (!reportToUpdate || !reportToUpdate.event_id) return;

    const newStatus = action === "verify" ? "Verified" : action === "dismiss" ? "Dismissed" : "Approved";

    const { error } = await supabase
      .from('events')
      .update({ status: newStatus })
      .eq('id', reportToUpdate.event_id);

    if (error) {
      console.error('Error updating report status:', error);
    } else {
        setReports((prev) =>
          prev.map((report) =>
            report.id === reportId ? { ...report, status: newStatus as HazardReport["status"] } : report
          )
        );
        if (selectedItem?.id === reportId) {
          setSelectedItem(null);
        }
    }
  };
  
  const stats: DashboardStats = {
    totalReports: reports.length,
    verifiedEvents: reports.filter(r => r.status === 'Verified').length,
    reportsLastHour: reports.filter(r => new Date(r.timestamp).getTime() > Date.now() - 60 * 60 * 1000).length,
    activeAlerts: reports.filter(r => r.status === 'Verified' || r.status === 'Approved').length
  };

  const selectedReportForMap = selectedItem && 'location' in selectedItem ? selectedItem : null;


  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <DashboardHeader stats={stats} userEmail={user?.email}/>

      {/* Main Layout */}
      <main className="flex-1 p-4 lg:p-6 overflow-hidden">
        <div className="h-full grid grid-cols-1 lg:grid-cols-[300px_1fr_350px] xl:grid-cols-[320px_1fr_384px] gap-4 lg:gap-6">
          {/* Left Sidebar */}
          <aside className="lg:h-[calc(100vh-200px)] overflow-hidden">
            <FiltersPanel filters={filters} onFilterChange={setFilters} />
          </aside>

          {/* Center - Map */}
          <section className="h-[400px] lg:h-[calc(100vh-200px)] min-h-0">
            <ClientOnly>
              <MapComponent
                reports={filteredReports}
                selectedReport={selectedReportForMap}
                onReportSelect={(report) => setSelectedItem(report)}
              />
            </ClientOnly>
          </section>

          {/* Right Sidebar */}
          <aside className="lg:h-[calc(100vh-200px)] overflow-hidden">
            <LiveAlertsPanel
              reports={filteredReports}
              socialPosts={socialPosts}
              selectedItem={selectedItem}
              onSelectItem={setSelectedItem}
              onReportAction={handleReportAction}
            />
          </aside>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;