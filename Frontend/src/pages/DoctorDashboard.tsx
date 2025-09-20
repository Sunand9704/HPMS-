import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, User, Stethoscope, CheckCircle, AlertCircle, LogOut, Phone, Download } from "lucide-react";
import { usePatientAuth } from "@/contexts/PatientAuthContext";
import { appointmentApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { jsPDF } from 'jspdf';

interface Appointment {
  _id: string;
  patient: {
    _id: string;
    name: string;
    age: number;
    gender: string;
    phone: string;
    email: string;
    medicalCondition?: string;
  };
  doctor: {
    _id: string;
    name: string;
    specialty: string;
    email: string;
    phone: string;
  };
  appointmentDate: string;
  appointmentTime: string;
  duration: number;
  type: string;
  status: string;
  reason: string;
  notes?: string;
  diagnosis?: string;
  prescription?: any[];
  medicines?: string;
  vitalSigns?: any;
  completedAt?: string;
}

const DoctorDashboard = () => {
  const { doctor, logout } = usePatientAuth();
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false);
  const [completionData, setCompletionData] = useState({
    diagnosis: "",
    notes: "",
    medicines: "",
    vitalSigns: {
      bloodPressure: "",
      heartRate: "",
      temperature: "",
      weight: "",
      height: "",
      oxygenSaturation: ""
    }
  });

  useEffect(() => {
    if (doctor?.id) {
      fetchAppointments();
    }
  }, [doctor?.id, statusFilter, dateFilter]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      console.log('Fetching appointments for doctor:', doctor?.id);
      const response = await appointmentApi.getByDoctor(doctor!.id, {
        status: statusFilter === "all" ? undefined : statusFilter,
        date: dateFilter || undefined,
        limit: 50
      });
      
      console.log('Appointments response:', response);
      if (response.success) {
        setAppointments(response.data.appointments || []);
      } else {
        console.error('API Error:', response.message);
        toast({
          title: "Error",
          description: response.message || "Failed to fetch appointments",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast({
        title: "Error",
        description: "Failed to fetch appointments. Please check your connection.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAppointmentSelect = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    
    // Pre-fill completion data with existing database data
    setCompletionData({
      diagnosis: appointment.diagnosis || "",
      notes: appointment.notes || "",
      medicines: appointment.medicines || "",
      vitalSigns: {
        bloodPressure: appointment.vitalSigns?.bloodPressure || "",
        heartRate: appointment.vitalSigns?.heartRate || "",
        temperature: appointment.vitalSigns?.temperature || "",
        weight: appointment.vitalSigns?.weight || "",
        height: appointment.vitalSigns?.height || "",
        oxygenSaturation: appointment.vitalSigns?.oxygenSaturation || ""
      }
    });
  };

  const handleCompleteAppointment = async () => {
    if (!selectedAppointment) return;

    try {
      const response = await appointmentApi.complete(selectedAppointment._id, completionData);
      
      if (response.success) {
        toast({
          title: "Success",
          description: "Appointment completed successfully"
        });
        setIsCompleteDialogOpen(false);
        setSelectedAppointment(null);
        setCompletionData({
          diagnosis: "",
          notes: "",
          medicines: "",
          vitalSigns: {
            bloodPressure: "",
            heartRate: "",
            temperature: "",
            weight: "",
            height: "",
            oxygenSaturation: ""
          }
        });
        fetchAppointments();
      }
    } catch (error) {
      console.error('Error completing appointment:', error);
      toast({
        title: "Error",
        description: "Failed to complete appointment",
        variant: "destructive"
      });
    }
  };

  const generatePrescriptionPDF = (appointment: Appointment) => {
    try {
      console.log('Generating PDF for appointment:', appointment);
      const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPosition = 20;

    // Header
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('MEDICAL PRESCRIPTION', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 10;

    // Hospital Info
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('NeoMedix Hospitals', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 5;
    doc.text('Best Multispecialty Healthcare', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 5;
    doc.text('Phone: +91 123 456 7890 | Email: info@neomedix.com', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;

    // Line separator
    doc.line(20, yPosition, pageWidth - 20, yPosition);
    yPosition += 10;

    // Patient Information
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('PATIENT INFORMATION', 20, yPosition);
    yPosition += 10;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Name: ${appointment.patient.name}`, 20, yPosition);
    doc.text(`Age: ${appointment.patient.age} years`, 120, yPosition);
    doc.text(`Gender: ${appointment.patient.gender}`, 180, yPosition);
    yPosition += 8;

    doc.text(`Phone: ${appointment.patient.phone}`, 20, yPosition);
    doc.text(`Email: ${appointment.patient.email}`, 120, yPosition);
    yPosition += 8;

    if (appointment.patient.medicalCondition) {
      doc.text(`Medical Condition: ${appointment.patient.medicalCondition}`, 20, yPosition);
      yPosition += 8;
    }

    yPosition += 5;

    // Appointment Details
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('APPOINTMENT DETAILS', 20, yPosition);
    yPosition += 10;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Date: ${formatDate(appointment.appointmentDate)}`, 20, yPosition);
    doc.text(`Time: ${formatTime(appointment.appointmentTime)}`, 120, yPosition);
    doc.text(`Type: ${appointment.type}`, 180, yPosition);
    yPosition += 8;

    doc.text(`Reason: ${appointment.reason}`, 20, yPosition);
    yPosition += 8;

    yPosition += 5;

    // Diagnosis
    if (appointment.diagnosis) {
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('DIAGNOSIS', 20, yPosition);
      yPosition += 10;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const diagnosisLines = doc.splitTextToSize(appointment.diagnosis, pageWidth - 40);
      doc.text(diagnosisLines, 20, yPosition);
      yPosition += diagnosisLines.length * 5 + 5;
    }

    // Medicines
    if (appointment.medicines) {
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('PRESCRIBED MEDICINES', 20, yPosition);
      yPosition += 10;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const medicineLines = doc.splitTextToSize(appointment.medicines, pageWidth - 40);
      doc.text(medicineLines, 20, yPosition);
      yPosition += medicineLines.length * 5 + 5;
    }

    // Vital Signs
    if (appointment.vitalSigns) {
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('VITAL SIGNS', 20, yPosition);
      yPosition += 10;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const vitalSigns = appointment.vitalSigns;
      if (vitalSigns.bloodPressure) doc.text(`Blood Pressure: ${vitalSigns.bloodPressure}`, 20, yPosition);
      if (vitalSigns.heartRate) doc.text(`Heart Rate: ${vitalSigns.heartRate} bpm`, 120, yPosition);
      yPosition += 8;
      if (vitalSigns.temperature) doc.text(`Temperature: ${vitalSigns.temperature}`, 20, yPosition);
      if (vitalSigns.weight) doc.text(`Weight: ${vitalSigns.weight}`, 120, yPosition);
      yPosition += 8;
      if (vitalSigns.height) doc.text(`Height: ${vitalSigns.height}`, 20, yPosition);
      if (vitalSigns.oxygenSaturation) doc.text(`Oxygen Saturation: ${vitalSigns.oxygenSaturation}%`, 120, yPosition);
      yPosition += 8;
    }

    // Notes
    if (appointment.notes) {
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('ADDITIONAL NOTES', 20, yPosition);
      yPosition += 10;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const notesLines = doc.splitTextToSize(appointment.notes, pageWidth - 40);
      doc.text(notesLines, 20, yPosition);
      yPosition += notesLines.length * 5 + 5;
    }

    // Doctor Information
    yPosition += 10;
    doc.line(20, yPosition, pageWidth - 20, yPosition);
    yPosition += 10;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`Dr. ${appointment.doctor.name}`, 20, yPosition);
    doc.text(`Specialty: ${appointment.doctor.specialty}`, 20, yPosition + 8);
    doc.text(`Phone: ${appointment.doctor.phone}`, 20, yPosition + 16);
    doc.text(`Email: ${appointment.doctor.email}`, 20, yPosition + 24);

    // Date and Signature
    doc.text(`Date: ${new Date().toLocaleDateString()}`, pageWidth - 60, yPosition);
    doc.text('Doctor Signature', pageWidth - 60, yPosition + 20);

    // Footer
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('This is a computer-generated prescription. Please keep this for your records.', pageWidth / 2, pageHeight - 20, { align: 'center' });

    // Download the PDF
    const fileName = `Prescription_${appointment.patient.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
    
    toast({
      title: "Success",
      description: "Prescription PDF downloaded successfully"
    });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'Scheduled': { variant: 'default' as const, icon: Clock },
      'In Progress': { variant: 'secondary' as const, icon: AlertCircle },
      'Completed': { variant: 'default' as const, icon: CheckCircle },
      'Cancelled': { variant: 'destructive' as const, icon: AlertCircle },
      'No Show': { variant: 'outline' as const, icon: AlertCircle },
      'Rescheduled': { variant: 'secondary' as const, icon: Clock }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.Scheduled;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {status}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
              <p className="text-muted-foreground">Please log in as a doctor to access this page.</p>
              <Button 
                className="mt-4" 
                onClick={() => window.location.href = '/'}
              >
                Go to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Stethoscope className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Doctor Dashboard</h1>
                <p className="text-sm text-gray-600">Manage your appointments and patient care</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                <Calendar className="h-4 w-4 inline mr-1" />
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={logout}
                className="flex items-center space-x-1"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome, {doctor.name}
          </h2>
          <p className="text-gray-600">Here are your upcoming appointments</p>
        </div>

        {/* Filters */}
        <Card className="mb-6 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 min-w-48">
                <Label htmlFor="status-filter" className="text-sm font-medium text-gray-700 mb-2 block">
                  Filter by Status
                </Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Scheduled">Scheduled</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                    <SelectItem value="No Show">No Show</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 min-w-48">
                <Label htmlFor="date-filter" className="text-sm font-medium text-gray-700 mb-2 block">
                  Filter by Date
                </Label>
                <Input
                  id="date-filter"
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="h-10"
                />
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={fetchAppointments} 
                  variant="outline"
                  className="h-10 px-6"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appointments List */}
        <div className="grid gap-6">
          {loading ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-muted-foreground">Loading appointments...</p>
                </div>
              </CardContent>
            </Card>
          ) : appointments.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Appointments Found</h3>
                  <p className="text-muted-foreground">No appointments match your current filters.</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            appointments.map((appointment) => (
              <Card key={appointment._id} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-semibold">{appointment.patient.name}</span>
                          <span className="text-sm text-muted-foreground">
                            ({appointment.patient.age} years, {appointment.patient.gender})
                          </span>
                        </div>
                        {getStatusBadge(appointment.status)}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-sm bg-gray-50 px-3 py-2 rounded-lg">
                          <Calendar className="h-4 w-4 text-blue-600" />
                          <span className="font-medium">{formatDate(appointment.appointmentDate)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm bg-gray-50 px-3 py-2 rounded-lg">
                          <Clock className="h-4 w-4 text-green-600" />
                          <span className="font-medium">{formatTime(appointment.appointmentTime)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm bg-gray-50 px-3 py-2 rounded-lg">
                          <Stethoscope className="h-4 w-4 text-purple-600" />
                          <span className="font-medium">{appointment.type}</span>
                        </div>
                      </div>

                      <div className="mb-4 space-y-2">
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-700">
                            <span className="font-semibold text-blue-800">Reason:</span> {appointment.reason}
                          </p>
                        </div>
                        {appointment.patient.medicalCondition && (
                          <div className="bg-orange-50 p-3 rounded-lg">
                            <p className="text-sm text-gray-700">
                              <span className="font-semibold text-orange-800">Medical Condition:</span> {appointment.patient.medicalCondition}
                            </p>
                          </div>
                        )}
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-700">
                            <span className="font-semibold">Contact:</span> {appointment.patient.phone} | {appointment.patient.email}
                          </p>
                        </div>
                      </div>

                      {appointment.diagnosis && (
                        <div className="mb-4 p-3 bg-green-50 rounded-lg">
                          <p className="text-sm">
                            <strong>Diagnosis:</strong> {appointment.diagnosis}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      {appointment.status === 'Scheduled' && (
                        <Dialog open={isCompleteDialogOpen} onOpenChange={setIsCompleteDialogOpen}>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              onClick={() => handleAppointmentSelect(appointment)}
                            >
                              Complete
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Complete Appointment</DialogTitle>
                              <DialogDescription>
                                Complete the appointment for {appointment.patient.name}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="diagnosis" className="flex items-center gap-2">
                                  Diagnosis
                                  {completionData.diagnosis && (
                                    <Badge variant="outline" className="text-xs">Pre-filled</Badge>
                                  )}
                                </Label>
                                <Textarea
                                  id="diagnosis"
                                  value={completionData.diagnosis}
                                  onChange={(e) => setCompletionData(prev => ({
                                    ...prev,
                                    diagnosis: e.target.value
                                  }))}
                                  placeholder="Enter diagnosis..."
                                  className={completionData.diagnosis ? "bg-blue-50" : ""}
                                />
                              </div>
                              <div>
                                <Label htmlFor="notes" className="flex items-center gap-2">
                                  Notes
                                  {completionData.notes && (
                                    <Badge variant="outline" className="text-xs">Pre-filled</Badge>
                                  )}
                                </Label>
                                <Textarea
                                  id="notes"
                                  value={completionData.notes}
                                  onChange={(e) => setCompletionData(prev => ({
                                    ...prev,
                                    notes: e.target.value
                                  }))}
                                  placeholder="Enter additional notes..."
                                  className={completionData.notes ? "bg-blue-50" : ""}
                                />
                              </div>
                              <div>
                                <Label htmlFor="medicines" className="flex items-center gap-2">
                                  Prescribed Medicines
                                  <Badge variant="secondary" className="text-xs">Doctor Input Required</Badge>
                                </Label>
                                <Textarea
                                  id="medicines"
                                  value={completionData.medicines}
                                  onChange={(e) => setCompletionData(prev => ({
                                    ...prev,
                                    medicines: e.target.value
                                  }))}
                                  placeholder="Enter prescribed medicines with dosage and instructions..."
                                  rows={4}
                                  className="bg-yellow-50 border-yellow-300"
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor="blood-pressure" className="flex items-center gap-2">
                                    Blood Pressure
                                    {completionData.vitalSigns.bloodPressure && (
                                      <Badge variant="outline" className="text-xs">Pre-filled</Badge>
                                    )}
                                  </Label>
                                  <Input
                                    id="blood-pressure"
                                    value={completionData.vitalSigns.bloodPressure}
                                    onChange={(e) => setCompletionData(prev => ({
                                      ...prev,
                                      vitalSigns: {
                                        ...prev.vitalSigns,
                                        bloodPressure: e.target.value
                                      }
                                    }))}
                                    placeholder="120/80"
                                    className={completionData.vitalSigns.bloodPressure ? "bg-blue-50" : ""}
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="heart-rate" className="flex items-center gap-2">
                                    Heart Rate
                                    {completionData.vitalSigns.heartRate && (
                                      <Badge variant="outline" className="text-xs">Pre-filled</Badge>
                                    )}
                                  </Label>
                                  <Input
                                    id="heart-rate"
                                    value={completionData.vitalSigns.heartRate}
                                    onChange={(e) => setCompletionData(prev => ({
                                      ...prev,
                                      vitalSigns: {
                                        ...prev.vitalSigns,
                                        heartRate: e.target.value
                                      }
                                    }))}
                                    placeholder="72"
                                    className={completionData.vitalSigns.heartRate ? "bg-blue-50" : ""}
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="temperature" className="flex items-center gap-2">
                                    Temperature
                                    {completionData.vitalSigns.temperature && (
                                      <Badge variant="outline" className="text-xs">Pre-filled</Badge>
                                    )}
                                  </Label>
                                  <Input
                                    id="temperature"
                                    value={completionData.vitalSigns.temperature}
                                    onChange={(e) => setCompletionData(prev => ({
                                      ...prev,
                                      vitalSigns: {
                                        ...prev.vitalSigns,
                                        temperature: e.target.value
                                      }
                                    }))}
                                    placeholder="98.6°F"
                                    className={completionData.vitalSigns.temperature ? "bg-blue-50" : ""}
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="weight" className="flex items-center gap-2">
                                    Weight
                                    {completionData.vitalSigns.weight && (
                                      <Badge variant="outline" className="text-xs">Pre-filled</Badge>
                                    )}
                                  </Label>
                                  <Input
                                    id="weight"
                                    value={completionData.vitalSigns.weight}
                                    onChange={(e) => setCompletionData(prev => ({
                                      ...prev,
                                      vitalSigns: {
                                        ...prev.vitalSigns,
                                        weight: e.target.value
                                      }
                                    }))}
                                    placeholder="70 kg"
                                    className={completionData.vitalSigns.weight ? "bg-blue-50" : ""}
                                  />
                                </div>
                              </div>
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  onClick={() => setIsCompleteDialogOpen(false)}
                                >
                                  Cancel
                                </Button>
                                <Button onClick={handleCompleteAppointment}>
                                  Complete Appointment
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                      {appointment.status === 'Completed' && (
                        <div className="flex flex-col gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => generatePrescriptionPDF(appointment)}
                            className="flex items-center space-x-1"
                          >
                            <Download className="h-4 w-4" />
                            <span>Download Prescription</span>
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => {
                              console.log('Appointment data:', appointment);
                              console.log('Medicines:', appointment.medicines);
                            }}
                          >
                            Debug Data
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
