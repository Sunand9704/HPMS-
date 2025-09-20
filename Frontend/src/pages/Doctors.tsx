import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, Search, Filter, Phone, Mail, MapPin, Calendar, Clock, GraduationCap, Award } from 'lucide-react';
import { doctorApi } from '@/lib/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AppointmentBookingModal from '@/components/AppointmentBookingModal';

interface Doctor {
  _id: string;
  name: string;
  email: string;
  phone: string;
  specialty: string;
  licenseNumber: string;
  experience: number;
  education: Array<{
    degree: string;
    institution: string;
    year: number;
  }>;
  rating: number;
  totalRatings: number;
  status: string;
  workingHours: {
    [key: string]: {
      start: string;
      end: string;
      isWorking: boolean;
    };
  };
  consultationFee: number;
  department: string;
  bio: string;
  languages: string[];
}

const Doctors = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Fetch doctors data
  const { data: doctorsResponse, isLoading, error } = useQuery({
    queryKey: ['doctors'],
    queryFn: () => doctorApi.getAll(),
  });

  const doctors: Doctor[] = doctorsResponse?.data?.doctors || [];

  // Filter and sort doctors
  const filteredDoctors = doctors
    .filter(doctor => {
      const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           doctor.department.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSpecialty = specialtyFilter === 'all' || doctor.specialty === specialtyFilter;
      return matchesSearch && matchesSpecialty;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'experience':
          return b.experience - a.experience;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'fee':
          return a.consultationFee - b.consultationFee;
        default:
          return 0;
      }
    });

  // Get unique specialties for filter
  const specialties = [...new Set(doctors.map(doctor => doctor.specialty))];

  // Handle booking appointment
  const handleBookAppointment = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setIsBookingModalOpen(true);
  };

  const handleCloseBookingModal = () => {
    setIsBookingModalOpen(false);
    setSelectedDoctor(null);
  };

  const formatWorkingHours = (workingHours: Doctor['workingHours']) => {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    return days.map((day, index) => {
      const hours = workingHours[day];
      if (hours?.isWorking) {
        return `${dayNames[index]}: ${hours.start}-${hours.end}`;
      }
      return null;
    }).filter(Boolean).join(', ');
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Doctors</h2>
            <p className="text-muted-foreground">Please try again later.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Meet Our Doctors</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our team of experienced and dedicated healthcare professionals is here to provide you with the best medical care.
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between md:space-x-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search doctors by name, specialty, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex space-x-4">
            <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by specialty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Specialties</SelectItem>
                {specialties.map(specialty => (
                  <SelectItem key={specialty} value={specialty}>
                    {specialty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="experience">Experience</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="fee">Consultation Fee</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {filteredDoctors.length} of {doctors.length} doctors
          </p>
        </div>

        {/* Doctors Grid */}
        {filteredDoctors.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">No doctors found</h3>
            <p className="text-muted-foreground">Try adjusting your search criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor) => (
              <Card key={doctor._id} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{doctor.name}</CardTitle>
                      <Badge variant="secondary" className="mb-2">
                        {doctor.specialty}
                      </Badge>
                      <p className="text-sm text-muted-foreground">{doctor.department}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1 mb-1">
                        {renderStars(doctor.rating)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {doctor.rating.toFixed(1)} ({doctor.totalRatings} reviews)
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Experience and Fee */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-1">
                      <Award className="h-4 w-4 text-primary" />
                      <span>{doctor.experience} years experience</span>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-primary">
                        ${doctor.consultationFee}
                      </span>
                      <span className="text-muted-foreground">/consultation</span>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {doctor.bio}
                  </p>

                  {/* Education */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-1 text-sm font-medium">
                      <GraduationCap className="h-4 w-4 text-primary" />
                      <span>Education</span>
                    </div>
                    <div className="space-y-1">
                      {doctor.education.slice(0, 2).map((edu, index) => (
                        <p key={index} className="text-xs text-muted-foreground">
                          {edu.degree} - {edu.institution} ({edu.year})
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* Languages */}
                  {doctor.languages && doctor.languages.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Languages</p>
                      <div className="flex flex-wrap gap-1">
                        {doctor.languages.map((language, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {language}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Working Hours */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-1 text-sm font-medium">
                      <Clock className="h-4 w-4 text-primary" />
                      <span>Working Hours</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatWorkingHours(doctor.workingHours)}
                    </p>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2 pt-2 border-t">
                    <div className="flex items-center space-x-2 text-sm">
                      <Phone className="h-4 w-4 text-primary" />
                      <span>{doctor.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Mail className="h-4 w-4 text-primary" />
                      <span className="truncate">{doctor.email}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2 pt-4">
                    <Button 
                      className="flex-1 bg-gradient-medical hover:bg-primary-hover"
                      onClick={() => handleBookAppointment(doctor)}
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Book Appointment
                    </Button>
                    <Button variant="outline" className="px-3">
                      <Phone className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Footer />

      {/* Appointment Booking Modal */}
      <AppointmentBookingModal
        isOpen={isBookingModalOpen}
        onClose={handleCloseBookingModal}
        doctor={selectedDoctor}
      />
    </div>
  );
};

export default Doctors;
