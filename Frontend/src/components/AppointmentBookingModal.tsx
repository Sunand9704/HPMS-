import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar as CalendarIcon, Clock, User, Phone, Mail, MessageSquare, X } from 'lucide-react';
import { format, addDays, isToday, isTomorrow, isAfter, startOfDay, endOfDay } from 'date-fns';
import { doctorApi, appointmentApi } from '@/lib/api';

interface Doctor {
  _id: string;
  name: string;
  email: string;
  phone: string;
  specialty: string;
  experience: number;
  consultationFee: number;
  department: string;
  workingHours: {
    [key: string]: {
      start: string;
      end: string;
      isWorking: boolean;
    };
  };
}

interface TimeSlot {
  time: string;
  available: boolean;
  appointmentId?: string;
}

interface AppointmentBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctor: Doctor | null;
}

const AppointmentBookingModal = ({ isOpen, onClose, doctor }: AppointmentBookingModalProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Patient information form
  const [patientInfo, setPatientInfo] = useState({
    name: '',
    email: '',
    phone: '',
    reason: '',
    notes: '',
    bloodPressure: '',
    heartRate: ''
  });

  // Generate time slots based on doctor's working hours
  const generateTimeSlots = (date: Date): TimeSlot[] => {
    if (!doctor) return [];

    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase(); // Get day name
    const workingDay = doctor.workingHours[dayName];
    
    if (!workingDay || !workingDay.isWorking) {
      return [];
    }

    const slots: TimeSlot[] = [];
    const startTime = workingDay.start;
    const endTime = workingDay.end;
    
    // Parse start and end times
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    
    // Generate 30-minute slots
    for (let minutes = startMinutes; minutes < endMinutes; minutes += 30) {
      const hour = Math.floor(minutes / 60);
      const min = minutes % 60;
      const timeString = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
      
      slots.push({
        time: timeString,
        available: true // For now, assume all slots are available
      });
    }
    
    return slots;
  };

  // Update available slots when date changes
  useEffect(() => {
    if (selectedDate && doctor) {
      const slots = generateTimeSlots(selectedDate);
      setAvailableSlots(slots);
      setSelectedTime(''); // Reset selected time when date changes
    }
  }, [selectedDate, doctor]);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setSelectedDate(new Date());
      setSelectedTime('');
      setPatientInfo({
        name: '',
        email: '',
        phone: '',
        reason: '',
        notes: ''
      });
      setError('');
      setSuccess(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime || !doctor) {
      setError('Please select a date and time');
      return;
    }

    if (!patientInfo.name || !patientInfo.email || !patientInfo.phone) {
      setError('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const appointmentData = {
        doctor: doctor._id,
        patient: {
          name: patientInfo.name,
          email: patientInfo.email,
          phone: patientInfo.phone
        },
        date: selectedDate.toISOString().split('T')[0],
        time: selectedTime,
        reason: patientInfo.reason,
        notes: patientInfo.notes,
        type: 'Consultation',
        status: 'Scheduled'
      };

      const response = await appointmentApi.create(appointmentData);
      
      if (response.success) {
        setSuccess(true);
        // Reset form after successful booking
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setError(response.message || 'Failed to book appointment');
      }
    } catch (error) {
      setError('An error occurred while booking the appointment');
      console.error('Booking error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    const tomorrow = addDays(today, 1);
    const maxDate = addDays(today, 30); // Allow booking up to 30 days in advance
    
    return date < startOfDay(tomorrow) || date > maxDate;
  };

  const getDateLabel = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'EEEE, MMMM do');
  };

  if (!doctor) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <CalendarIcon className="h-5 w-5" />
            <span>Book Appointment with Dr. {doctor.name}</span>
          </DialogTitle>
          <DialogDescription>
            {doctor.specialty} • {doctor.experience} years experience • ${doctor.consultationFee}/consultation
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CalendarIcon className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-green-800 mb-2">Appointment Booked Successfully!</h3>
            <p className="text-muted-foreground">
              Your appointment has been scheduled for {getDateLabel(selectedDate!)} at {selectedTime}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Date Selection */}
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-medium">Select Date</Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    Choose your preferred appointment date
                  </p>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={isDateDisabled}
                    className="rounded-md border"
                  />
                </div>

                {/* Time Selection */}
                {selectedDate && availableSlots.length > 0 && (
                  <div>
                    <Label className="text-base font-medium">Available Time Slots</Label>
                    <p className="text-sm text-muted-foreground mb-3">
                      {getDateLabel(selectedDate)}
                    </p>
                    <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto">
                      {availableSlots.map((slot) => (
                        <Button
                          key={slot.time}
                          type="button"
                          variant={selectedTime === slot.time ? "default" : "outline"}
                          size="sm"
                          disabled={!slot.available}
                          onClick={() => setSelectedTime(slot.time)}
                          className="text-xs"
                        >
                          {slot.time}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {selectedDate && availableSlots.length === 0 && (
                  <div className="text-center py-4 text-muted-foreground">
                    <Clock className="h-8 w-8 mx-auto mb-2" />
                    <p>No available slots for this date</p>
                    <p className="text-sm">Please select another date</p>
                  </div>
                )}
              </div>

              {/* Patient Information */}
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-medium">Patient Information</Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    Please provide your contact details
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={patientInfo.name}
                      onChange={(e) => setPatientInfo(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={patientInfo.email}
                      onChange={(e) => setPatientInfo(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={patientInfo.phone}
                      onChange={(e) => setPatientInfo(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="bloodPressure">Blood Pressure (BP)</Label>
                      <Input
                        id="bloodPressure"
                        value={patientInfo.bloodPressure}
                        onChange={(e) => setPatientInfo(prev => ({ ...prev, bloodPressure: e.target.value }))}
                        placeholder="e.g., 120/80"
                      />
                    </div>
                    <div>
                      <Label htmlFor="heartRate">Heart Rate (BPM)</Label>
                      <Input
                        id="heartRate"
                        type="number"
                        value={patientInfo.heartRate}
                        onChange={(e) => setPatientInfo(prev => ({ ...prev, heartRate: e.target.value }))}
                        placeholder="e.g., 72"
                        min="30"
                        max="200"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="reason">Reason for Visit</Label>
                    <Select
                      value={patientInfo.reason}
                      onValueChange={(value) => setPatientInfo(prev => ({ ...prev, reason: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select reason for visit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="consultation">General Consultation</SelectItem>
                        <SelectItem value="follow-up">Follow-up Visit</SelectItem>
                        <SelectItem value="checkup">Regular Checkup</SelectItem>
                        <SelectItem value="emergency">Emergency</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      value={patientInfo.notes}
                      onChange={(e) => setPatientInfo(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Any additional information or symptoms..."
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Appointment Summary */}
            {selectedDate && selectedTime && (
              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-medium mb-2">Appointment Summary</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Date:</span>
                    <span className="ml-2 font-medium">{getDateLabel(selectedDate)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Time:</span>
                    <span className="ml-2 font-medium">{selectedTime}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Doctor:</span>
                    <span className="ml-2 font-medium">Dr. {doctor.name}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Fee:</span>
                    <span className="ml-2 font-medium">${doctor.consultationFee}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!selectedDate || !selectedTime || submitting}
                className="bg-gradient-medical hover:bg-primary-hover"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Booking...
                  </>
                ) : (
                  <>
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Book Appointment
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentBookingModal;
