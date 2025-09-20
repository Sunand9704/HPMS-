import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { patientAPI } from "@/lib/api";
import { usePaginatedAPI } from "@/hooks/useAPI";
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
  Heart, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  Eye,
  Edit,
  Download,
  Phone
} from "lucide-react";

// Mock data removed - using API data

const statusColors = {
  "Active": "bg-success text-success-foreground",
  "Follow-up": "bg-warning text-warning-foreground",
  "Critical": "bg-danger text-danger-foreground",
  "Inactive": "bg-muted text-muted-foreground"
};

export default function Patients() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");

  // Fetch patients data from API
  const { 
    data: patients, 
    pagination, 
    loading, 
    error, 
    goToPage, 
    refetch 
  } = usePaginatedAPI(
    (page, limit, filters) => patientAPI.getAll({
      page,
      limit,
      search: searchQuery || undefined,
      status: selectedStatus !== "All" ? selectedStatus : undefined,
      ...filters
    }),
    1,
    10,
    { search: searchQuery, status: selectedStatus }
  );

  // Handle search and filter changes
  const handleSearch = (value: string) => {
    setSearchQuery(value);
    // Refetch with new search term
    refetch();
  };

  const handleStatusFilter = (status: string) => {
    setSelectedStatus(status);
    // Refetch with new status filter
    refetch();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-heading text-foreground">Patient Management</h1>
          <p className="text-muted-foreground mt-2">
            Monitor and manage patient records and care
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" className="border-border">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Button className="bg-gradient-primary hover:bg-primary-hover">
            <Plus className="w-4 h-4 mr-2" />
            Add Patient
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Heart className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Patients</p>
                <p className="text-2xl font-bold">{pagination?.total || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-success/10 rounded-lg">
                <Heart className="w-4 h-4 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">{patients?.filter(p => p.status === "Active").length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-danger/10 rounded-lg">
                <Heart className="w-4 h-4 text-danger" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Critical</p>
                <p className="text-2xl font-bold">{patients?.filter(p => p.status === "Critical").length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-warning/10 rounded-lg">
                <Heart className="w-4 h-4 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Follow-up</p>
                <p className="text-2xl font-bold">{patients?.filter(p => p.status === "Follow-up").length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Patients Table */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Patient Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search patients..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
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
                <DropdownMenuItem onClick={() => handleStatusFilter("All")}>
                  All Status
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusFilter("Active")}>
                  Active
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusFilter("Critical")}>
                  Critical
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusFilter("Follow-up")}>
                  Follow-up
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusFilter("Inactive")}>
                  Inactive
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="rounded-md border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient Name</TableHead>
                  <TableHead>Age/Gender</TableHead>
                  <TableHead>Assigned Doctor</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead>Last Visit</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                        <span className="ml-2">Loading patients...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-danger">
                      Error loading patients: {error}
                    </TableCell>
                  </TableRow>
                ) : patients && patients.length > 0 ? (
                  patients.map((patient: any) => (
                    <TableRow key={patient._id} className="hover:bg-accent/50">
                      <TableCell className="font-medium">{patient.name}</TableCell>
                      <TableCell>{patient.age}Y • {patient.gender}</TableCell>
                      <TableCell>{patient.assignedDoctor?.name || 'N/A'}</TableCell>
                      <TableCell>{patient.medicalCondition}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(patient.lastVisit).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[patient.status as keyof typeof statusColors]}>
                          {patient.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" className="p-1">
                          <Phone className="w-3 h-3 mr-1" />
                          {patient.phone}
                        </Button>
                      </TableCell>
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
                              Edit Record
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" />
                              Export Data
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No patients found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}