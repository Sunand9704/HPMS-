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
  Users as UsersIcon, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  Edit,
  Trash2,
  UserX
} from "lucide-react";

const mockUsers = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@healthcare.com",
    role: "Doctor",
    status: "Active",
    lastLogin: "2 hours ago",
    department: "Cardiology"
  },
  {
    id: 2,
    name: "Mike Chen",
    email: "mike.chen@healthcare.com", 
    role: "Nurse",
    status: "Active",
    lastLogin: "1 day ago",
    department: "Emergency"
  },
  {
    id: 3,
    name: "Emily Davis",
    email: "emily.davis@healthcare.com",
    role: "Admin",
    status: "Active", 
    lastLogin: "3 hours ago",
    department: "Administration"
  },
  {
    id: 4,
    name: "Robert Wilson",
    email: "robert.wilson@healthcare.com",
    role: "Technician",
    status: "Inactive",
    lastLogin: "1 week ago",
    department: "Laboratory"
  },
  {
    id: 5,
    name: "Lisa Anderson",
    email: "lisa.anderson@healthcare.com",
    role: "Doctor",
    status: "Active",
    lastLogin: "30 minutes ago",
    department: "Pediatrics"
  }
];

const roleColors = {
  "Doctor": "bg-primary text-primary-foreground",
  "Nurse": "bg-secondary text-secondary-foreground", 
  "Admin": "bg-warning text-warning-foreground",
  "Technician": "bg-accent text-accent-foreground"
};

const statusColors = {
  "Active": "bg-success text-success-foreground",
  "Inactive": "bg-muted text-muted-foreground"
};

export default function Users() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === "All" || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-heading text-foreground">User Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage system users and their permissions
          </p>
        </div>
        <Button className="bg-gradient-primary hover:bg-primary-hover">
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <UsersIcon className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{mockUsers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-success/10 rounded-lg">
                <UsersIcon className="w-4 h-4 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">{mockUsers.filter(u => u.status === "Active").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <UsersIcon className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Doctors</p>
                <p className="text-2xl font-bold">{mockUsers.filter(u => u.role === "Doctor").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-secondary/10 rounded-lg">
                <UsersIcon className="w-4 h-4 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Staff</p>
                <p className="text-2xl font-bold">{mockUsers.filter(u => u.role !== "Doctor").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-border">
                  <Filter className="w-4 h-4 mr-2" />
                  Role: {selectedRole}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSelectedRole("All")}>
                  All Roles
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedRole("Doctor")}>
                  Doctor
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedRole("Nurse")}>
                  Nurse  
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedRole("Admin")}>
                  Admin
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedRole("Technician")}>
                  Technician
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Users Table */}
          <div className="rounded-md border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-accent/50">
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge className={roleColors[user.role as keyof typeof roleColors]}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.department}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusColors[user.status as keyof typeof statusColors]}>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{user.lastLogin}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <UserX className="mr-2 h-4 w-4" />
                            {user.status === "Active" ? "Suspend" : "Activate"}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-danger">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete User
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