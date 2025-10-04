"use client";

import { Card } from '@/components/ui/card';
import { Waves, CheckCircle, Clock, AlertTriangle, User, LogOut } from 'lucide-react';
import { DashboardStats } from '@/types/dashboard';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import IssueAlertButton from './IssueAlertButton'; // Import the new button

interface DashboardHeaderProps {
  stats: DashboardStats;
  userEmail?: string | null;
}

const DashboardHeader = ({ stats, userEmail }: DashboardHeaderProps) => {
  const router = useRouter();
  const { signOut, user } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    // After sign-out, redirect to homepage
    router.push("/");
  };

  return (
    <header className="bg-transparent border-border shadow-md">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-4 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <Waves className="h-9 w-9 text-blue-600 drop-shadow-md" />
          <h1 className="text-2xl font-extrabold tracking-wider text-foreground drop-shadow">
            SAMUDRA PRAHARI
          </h1>
        </div>
        <div className="flex items-center space-x-4">
           {/* Add the new IssueAlertButton here */}
          <IssueAlertButton />
          <div className="flex items-center space-x-2 bg-card/60 rounded-lg px-3 py-2 border-border shadow-sm backdrop-blur-sm bg-gradient-to-r from-indigo-400 to-purple-400">
            <User className="h-5 w-5 text-blue-500" />
            <span className="text-sm font-medium text-foreground ">{user?.email || 'Analyst View'}</span>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center px-3 py-2 text-sm font-medium rounded-md 
                      bg-red-500 text-white shadow-sm 
                      hover:bg-red-600 transition-colors"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-6 pb-6 mt-4">
        <KpiCard
          icon={<Waves />}
          title="Total Reports"
          value={stats.totalReports.toLocaleString()}
          subtitle="Past 30 days"
          color="primary"
        />
        <KpiCard
          icon={<CheckCircle />}
          title="Verified Events"
          value={stats.verifiedEvents.toLocaleString()}
          subtitle="Past 30 days"
          color="success"
        />
        <KpiCard
          icon={<Clock />}
          title="Reports Last Hour"
          value={stats.reportsLastHour}
          subtitle="New incoming data"
          color="info"
        />
        <KpiCard
          icon={<AlertTriangle />}
          title="Active Alerts"
          value={stats.activeAlerts}
          subtitle="Currently ongoing"
          color="warning"
        />
      </div>
    </header>
  );
};

// KPI Card Component
const KpiCard = ({
  icon,
  title,
  value,
  subtitle,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  subtitle: string;
  color: string;
}) => {
  const colorClasses: { [key: string]: string } = {
    primary: 'text-blue-500 bg-blue-500/10',
    success: 'text-green-500 bg-green-500/10',
    info: 'text-cyan-400 bg-cyan-400/10',
    warning: 'text-yellow-500 bg-yellow-500/10',
  };

  return (
    <Card className="bg-white/10 backdrop-blur-lg border border-white/20 p-5 rounded-xl shadow-md hover:shadow-lg hover:shadow-blue-500/30 transition-all">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        </div>
        <div
          className={`h-12 w-12 rounded-xl flex items-center justify-center shadow-inner ${colorClasses[color]}`}
        >
          {icon}
        </div>
      </div>
    </Card>
  );
};

export default DashboardHeader;
