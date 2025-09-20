import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  Activity,
  Download
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
  AreaChart,
  Area,
} from "recharts";

const patientRegistrationData = [
  { month: "Jan", patients: 45, target: 50 },
  { month: "Feb", patients: 52, target: 55 },
  { month: "Mar", patients: 38, target: 50 },
  { month: "Apr", patients: 67, target: 60 },
  { month: "May", patients: 71, target: 65 },
  { month: "Jun", patients: 83, target: 70 },
];

const appointmentTrendsData = [
  { date: "Jan 15", completed: 24, cancelled: 3, noShow: 2 },
  { date: "Jan 16", completed: 31, cancelled: 2, noShow: 1 },
  { date: "Jan 17", completed: 28, cancelled: 4, noShow: 3 },
  { date: "Jan 18", completed: 35, cancelled: 1, noShow: 2 },
  { date: "Jan 19", completed: 29, cancelled: 5, noShow: 1 },
  { date: "Jan 20", completed: 33, cancelled: 2, noShow: 4 },
];

const doctorUtilizationData = [
  { name: "Dr. Sarah Johnson", utilization: 92, patients: 142 },
  { name: "Dr. Lisa Anderson", utilization: 88, patients: 134 },
  { name: "Dr. Michael Chen", utilization: 85, patients: 98 },
  { name: "Dr. Emily Davis", utilization: 78, patients: 87 },
  { name: "Dr. Robert Wilson", utilization: 65, patients: 76 },
];

const departmentData = [
  { name: "Cardiology", value: 35, color: "hsl(var(--danger))" },
  { name: "Pediatrics", value: 28, color: "hsl(var(--success))" },
  { name: "Neurology", value: 20, color: "hsl(var(--primary))" },
  { name: "Orthopedics", value: 12, color: "hsl(var(--secondary))" },
  { name: "Dermatology", value: 5, color: "hsl(var(--warning))" },
];

const kpiData = [
  {
    title: "Patient Satisfaction",
    value: "94.2%",
    change: { value: 2.1, type: "increase" as const },
    icon: Users,
  },
  {
    title: "Appointment Success Rate",
    value: "89.7%",
    change: { value: 1.4, type: "increase" as const },
    icon: Calendar,
  },
  {
    title: "Average Wait Time",
    value: "12 min",
    change: { value: 8.3, type: "decrease" as const },
    icon: Activity,
  },
  {
    title: "Revenue Growth",
    value: "$2.4M",
    change: { value: 15.2, type: "increase" as const },
    icon: TrendingUp,
  },
];

export default function Analytics() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-heading text-foreground">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Monitor performance metrics and healthcare insights
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Select defaultValue="30days">
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="1year">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="border-border">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={index} className="shadow-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                      {kpi.title}
                    </p>
                    <p className="text-3xl font-bold text-foreground">
                      {kpi.value}
                    </p>
                    <div className="flex items-center space-x-1">
                      {kpi.change.type === "increase" ? (
                        <TrendingUp className="w-4 h-4 text-success" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-success" />
                      )}
                      <span className="text-sm font-medium text-success">
                        {kpi.change.value}%
                      </span>
                      <span className="text-sm text-muted-foreground">vs last period</span>
                    </div>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Patient Registration Trends */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              <span>Patient Registration Trends</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={patientRegistrationData}>
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
                <Area 
                  type="monotone" 
                  dataKey="patients" 
                  stroke="hsl(var(--primary))" 
                  fill="hsl(var(--primary) / 0.2)"
                  strokeWidth={2}
                />
                <Area 
                  type="monotone" 
                  dataKey="target" 
                  stroke="hsl(var(--secondary))" 
                  fill="hsl(var(--secondary) / 0.1)"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Department Distribution */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-success" />
              <span>Patient Distribution by Department</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Additional Charts */}
      <div className="grid grid-cols-1 gap-6">
        {/* Appointment Success Rates */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-secondary" />
              <span>Appointment Trends (Last 7 Days)</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={appointmentTrendsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px"
                  }}
                />
                <Bar dataKey="completed" stackId="a" fill="hsl(var(--success))" />
                <Bar dataKey="cancelled" stackId="a" fill="hsl(var(--warning))" />
                <Bar dataKey="noShow" stackId="a" fill="hsl(var(--danger))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Doctor Utilization */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-warning" />
              <span>Doctor Utilization Rates</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {doctorUtilizationData.map((doctor, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-accent/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <div>
                      <p className="font-medium">{doctor.name}</p>
                      <p className="text-sm text-muted-foreground">{doctor.patients} patients</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-muted rounded-full h-2">
                      <div 
                        className="h-2 bg-primary rounded-full" 
                        style={{ width: `${doctor.utilization}%` }}
                      ></div>
                    </div>
                    <Badge variant="outline" className="min-w-[60px] justify-center">
                      {doctor.utilization}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}