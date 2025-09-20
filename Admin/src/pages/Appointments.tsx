import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Clock,
  Edit,
  Phone
} from "lucide-react";

const mockAppointments = [
  {
    id: 1,
    patient: "Emma Thompson",
    doctor: "Dr. Sarah Johnson",
    date: "2024-01-20",
    time: "09:30 AM",
    type: "Consultation", 
    status: "Scheduled",
    duration: "30 min",
    reason: "Regular Checkup"
  },
  {
    id: 2,
    patient: "James Wilson",
    doctor: "Dr. Lisa Anderson",
    date: "2024-01-20",
    time: "10:00 AM",
    type: "Follow-up",
    status: "In Progress", 
    duration: "45 min",
    reason: "Diabetes Management"
  },
  {
    id: 3,
    patient: "Maria Garcia",
    doctor: "Dr. Michael Chen",
    date: "2024-01-20",
    time: "11:30 AM",
    type: "Emergency",
    status: "Completed",
    duration: "60 min", 
    reason: "Chest Pain"
  },
  {
    id: 4,
    patient: "Robert Brown",
    doctor: "Dr. Emily Davis",
    date: "2024-01-20",
    time: "02:00 PM",
    type: "Consultation",
    status: "Cancelled",
    duration: "30 min",
    reason: "Skin Examination"
  },
  {
    id: 5,
    patient: "Jennifer Lee",
    doctor: "Dr. Sarah Johnson",
    date: "2024-01-20",
    time: "03:30 PM",
    type: "Surgery Prep",
    status: "Scheduled",
    duration: "90 min",
    reason: "Pre-operative Assessment"
  }
];

const statusColors = {
  "Scheduled": "bg-primary text-primary-foreground",
  "In Progress": "bg-warning text-warning-foreground",
  "Completed": "bg-success text-success-foreground",
  "Cancelled": "bg-muted text-muted-foreground",
  "No Show": "bg-danger text-danger-foreground"
};

const typeColors = {
  "Consultation": "bg-primary/10 text-primary border-primary/20",
  "Follow-up": "bg-secondary/10 text-secondary border-secondary/20",
  "Emergency": "bg-danger/10 text-danger border-danger/20",
  "Surgery Prep": "bg-warning/10 text-warning border-warning/20"
};

export default function Appointments() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const filteredAppointments = mockAppointments.filter(appointment => {
    const matchesSearch = appointment.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         appointment.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         appointment.reason.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "All" || appointment.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-heading text-foreground">Appointment Management</h1>
          <p className="text-muted-foreground mt-2">
            Schedule and manage patient appointments
          </p>
        </div>
        <Button className="bg-gradient-primary hover:bg-primary-hover">
          <Plus className="w-4 h-4 mr-2" />
          Schedule Appointment
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <CalendarIcon className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Today's Appointments</p>
                <p className="text-2xl font-bold">{mockAppointments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-success/10 rounded-lg">
                <CheckCircle className="w-4 h-4 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{mockAppointments.filter(a => a.status === "Completed").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-warning/10 rounded-lg">
                <Clock className="w-4 h-4 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold">{mockAppointments.filter(a => a.status === "In Progress").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-danger/10 rounded-lg">
                <XCircle className="w-4 h-4 text-danger" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Cancelled</p>
                <p className="text-2xl font-bold">{mockAppointments.filter(a => a.status === "Cancelled").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Appointments Table */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CalendarIcon className="w-5 h-5 text-primary" />
            <span>Today's Schedule - January 20, 2024</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search appointments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-border">
                  <Filter className="w-4 h-4 mr-2" />
                  Status: {selectedStatus}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSelectedStatus("All")}>
                  All Status
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedStatus("Scheduled")}>
                  Scheduled
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedStatus("In Progress")}>
                  In Progress
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedStatus("Completed")}>
                  Completed
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedStatus("Cancelled")}>
                  Cancelled
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="rounded-md border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAppointments.map((appointment) => (
                  <TableRow key={appointment.id} className="hover:bg-accent/50">
                    <TableCell className="font-medium">{appointment.time}</TableCell>
                    <TableCell>{appointment.patient}</TableCell>
                    <TableCell>{appointment.doctor}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline"
                        className={typeColors[appointment.type as keyof typeof typeColors]}
                      >
                        {appointment.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{appointment.reason}</TableCell>
                    <TableCell className="text-muted-foreground">{appointment.duration}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[appointment.status as keyof typeof statusColors]}>
                        {appointment.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {appointment.status === "Scheduled" && (
                            <>
                              <DropdownMenuItem className="text-success">
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Mark Complete
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Clock className="mr-2 h-4 w-4" />
                                Start Session
                              </DropdownMenuItem>
                            </>
                          )}
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Appointment
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Phone className="mr-2 h-4 w-4" />
                            Contact Patient
                          </DropdownMenuItem>
                          {appointment.status !== "Cancelled" && (
                            <DropdownMenuItem className="text-danger">
                              <XCircle className="mr-2 h-4 w-4" />
                              Cancel
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}