import { StatsCard } from "@/components/Dashboard/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { dashboardAPI } from "@/lib/api";
import { useAPI } from "@/hooks/useAPI";
import {
  Users,
  UserCheck,
  Calendar,
  AlertTriangle,
  TrendingUp,
  Activity,
  Clock,
  CheckCircle
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Dynamic stats data will be populated from API

// Dynamic data will be populated from API

export default function Dashboard() {
  // Fetch dashboard data from API
  const { data: overview, loading: overviewLoading, error: overviewError } = useAPI(() => dashboardAPI.getOverview());
  const { data: patientGrowth, loading: growthLoading } = useAPI(() => dashboardAPI.getPatientGrowth(6));
  const { data: appointmentAnalytics, loading: analyticsLoading } = useAPI(() => dashboardAPI.getAppointmentAnalytics());
  const { data: alerts, loading: alertsLoading } = useAPI(() => dashboardAPI.getAlerts());
  const { data: activities, loading: activitiesLoading } = useAPI(() => dashboardAPI.getActivities(10));

  // Create stats data from API response
  const statsData = overview ? [
    {
      title: "Total Patients",
      value: overview.totalPatients?.toString() || "0",
      change: { value: 12.5, type: "increase" as const },
      icon: Users,
      variant: "primary" as const,
    },
    {
      title: "Active Doctors",
      value: overview.totalDoctors?.toString() || "0",
      change: { value: 3.2, type: "increase" as const },
      icon: UserCheck,
      variant: "secondary" as const,
    },
    {
      title: "Today's Appointments",
      value: overview.todayAppointments?.toString() || "0",
      change: { value: 8.1, type: "increase" as const },
      icon: Calendar,
      variant: "success" as const,
    },
    {
      title: "System Alerts",
      value: alerts?.totalAlerts?.toString() || "0",
      change: { value: 2.3, type: "decrease" as const },
      icon: AlertTriangle,
      variant: "warning" as const,
    },
  ] : [];

  // Transform patient growth data for chart
  const patientGrowthData = patientGrowth || [];
  
  // Transform appointment data for pie chart
  const appointmentData = appointmentAnalytics?.statusDistribution ? [
    { name: "Completed", value: appointmentAnalytics.statusDistribution.Completed || 0, color: "hsl(var(--success))" },
    { name: "Scheduled", value: appointmentAnalytics.statusDistribution.Scheduled || 0, color: "hsl(var(--primary))" },
    { name: "Cancelled", value: appointmentAnalytics.statusDistribution.Cancelled || 0, color: "hsl(var(--danger))" },
    { name: "No Show", value: appointmentAnalytics.statusDistribution['No Show'] || 0, color: "hsl(var(--warning))" },
  ] : [];

  // Transform activities data
  const recentActivities = activities || [];

  if (overviewLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (overviewError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-danger">Error loading dashboard: {overviewError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-heading text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back! Here's what's happening at your healthcare facility today.
          </p>
        </div>
        <Button className="bg-gradient-primary hover:bg-primary-hover">
          <TrendingUp className="w-4 h-4 mr-2" />
          Generate Report
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Patient Growth Chart */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-primary" />
              <span>Patient Growth Trend</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={patientGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px"
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="patients" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Appointment Status */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-success" />
              <span>Appointment Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={appointmentData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {appointmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-secondary" />
            <span>Recent Activities</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-4 bg-accent/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.status === 'success' ? 'bg-success' :
                    activity.status === 'warning' ? 'bg-warning' : 'bg-primary'
                  }`} />
                  <div>
                    <p className="font-medium text-foreground">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">Patient: {activity.patient}</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-muted-foreground">
                  {activity.time}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}