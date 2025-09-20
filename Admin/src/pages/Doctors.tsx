import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  UserCheck, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  Eye,
  Edit,
  UserX,
  Star,
  Calendar
} from "lucide-react";

const mockDoctors = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: "Cardiology",
    email: "sarah.johnson@healthcare.com",
    phone: "(555) 123-4567",
    patients: 142,
    experience: "15 years",
    status: "Active",
    rating: 4.9,
    nextAvailable: "Today 2:30 PM"
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    specialty: "Neurology", 
    email: "michael.chen@healthcare.com",
    phone: "(555) 234-5678",
    patients: 98,
    experience: "12 years",
    status: "Active",
    rating: 4.8,
    nextAvailable: "Tomorrow 9:00 AM"
  },
  {
    id: 3,
    name: "Dr. Lisa Anderson",
    specialty: "Pediatrics",
    email: "lisa.anderson@healthcare.com",
    phone: "(555) 345-6789",
    patients: 187,
    experience: "18 years",
    status: "Active",
    rating: 4.9,
    nextAvailable: "Today 4:00 PM"
  },
  {
    id: 4,
    name: "Dr. Robert Wilson",
    specialty: "Orthopedics",
    email: "robert.wilson@healthcare.com",
    phone: "(555) 456-7890",
    patients: 76,
    experience: "8 years",
    status: "On Leave",
    rating: 4.6,
    nextAvailable: "Next Week"
  },
  {
    id: 5,
    name: "Dr. Emily Davis",
    specialty: "Dermatology",
    email: "emily.davis@healthcare.com",
    phone: "(555) 567-8901",
    patients: 134,
    experience: "10 years",
    status: "Active",
    rating: 4.7,
    nextAvailable: "Tomorrow 11:30 AM"
  }
];

const statusColors = {
  "Active": "bg-success text-success-foreground",
  "On Leave": "bg-warning text-warning-foreground",
  "Unavailable": "bg-muted text-muted-foreground"
};

const specialtyColors = {
  "Cardiology": "bg-danger/10 text-danger border-danger/20",
  "Neurology": "bg-primary/10 text-primary border-primary/20",
  "Pediatrics": "bg-success/10 text-success border-success/20",
  "Orthopedics": "bg-secondary/10 text-secondary border-secondary/20",
  "Dermatology": "bg-warning/10 text-warning border-warning/20"
};

export default function Doctors() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");

  const filteredDoctors = mockDoctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doctor.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = selectedSpecialty === "All" || doctor.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-heading text-foreground">Doctor Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage medical staff and their specialties
          </p>
        </div>
        <Button className="bg-gradient-primary hover:bg-primary-hover">
          <Plus className="w-4 h-4 mr-2" />
          Add Doctor
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <UserCheck className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Doctors</p>
                <p className="text-2xl font-bold">{mockDoctors.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-success/10 rounded-lg">
                <UserCheck className="w-4 h-4 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">{mockDoctors.filter(d => d.status === "Active").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-secondary/10 rounded-lg">
                <Calendar className="w-4 h-4 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Specialties</p>
                <p className="text-2xl font-bold">5</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-warning/10 rounded-lg">
                <Star className="w-4 h-4 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Rating</p>
                <p className="text-2xl font-bold">4.8</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Doctors Table */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Medical Staff</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search doctors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-border">
                  <Filter className="w-4 h-4 mr-2" />
                  Specialty: {selectedSpecialty}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSelectedSpecialty("All")}>
                  All Specialties
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedSpecialty("Cardiology")}>
                  Cardiology
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedSpecialty("Neurology")}>
                  Neurology
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedSpecialty("Pediatrics")}>
                  Pediatrics
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedSpecialty("Orthopedics")}>
                  Orthopedics
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="rounded-md border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Specialty</TableHead>
                  <TableHead>Patients</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Next Available</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDoctors.map((doctor) => (
                  <TableRow key={doctor.id} className="hover:bg-accent/50">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={`/placeholder-doctor-${doctor.id}.jpg`} />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {doctor.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{doctor.name}</p>
                          <p className="text-sm text-muted-foreground">{doctor.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={specialtyColors[doctor.specialty as keyof typeof specialtyColors]}
                      >
                        {doctor.specialty}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{doctor.patients}</TableCell>
                    <TableCell>{doctor.experience}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-warning fill-warning" />
                        <span>{doctor.rating}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[doctor.status as keyof typeof statusColors]}>
                        {doctor.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{doctor.nextAvailable}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Calendar className="mr-2 h-4 w-4" />
                            View Schedule
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-warning">
                            <UserX className="mr-2 h-4 w-4" />
                            Set On Leave
                          </DropdownMenuItem>
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