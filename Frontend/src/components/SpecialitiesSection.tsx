import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Heart, 
  Brain, 
  Bone, 
  Eye, 
  Stethoscope, 
  Zap, 
  Baby, 
  Pill,
  Scissors,
  Shield,
  ArrowRight
} from "lucide-react";

const SpecialitiesSection = () => {
  const specialities = [
    {
      icon: Heart,
      title: "Cardiology",
      description: "Expert heart care with advanced cardiac procedures and preventive treatments.",
      color: "bg-red-500",
    },
    {
      icon: Brain,
      title: "Neurology",
      description: "Comprehensive neurological care for brain and nervous system disorders.",
      color: "bg-purple-500",
    },
    {
      icon: Bone,
      title: "Orthopaedics",
      description: "Complete bone and joint care with minimally invasive surgical options.",
      color: "bg-blue-500",
    },
    {
      icon: Eye,
      title: "Ophthalmology",
      description: "Advanced eye care services including LASIK and cataract surgery.",
      color: "bg-green-500",
    },
    {
      icon: Stethoscope,
      title: "Internal Medicine",
      description: "Primary care and treatment for adult diseases and health conditions.",
      color: "bg-medical-blue",
    },
    {
      icon: Zap,
      title: "Emergency Care",
      description: "24/7 emergency services with rapid response medical team.",
      color: "bg-red-600",
    },
    {
      icon: Baby,
      title: "Pediatrics",
      description: "Specialized healthcare services for infants, children, and adolescents.",
      color: "bg-pink-500",
    },
    {
      icon: Pill,
      title: "Oncology",
      description: "Comprehensive cancer care with latest treatment modalities.",
      color: "bg-orange-500",
    },
    {
      icon: Scissors,
      title: "General Surgery",
      description: "Advanced surgical procedures with minimally invasive techniques.",
      color: "bg-teal-500",
    },
    {
      icon: Shield,
      title: "Pulmonology",
      description: "Respiratory care and treatment for lung-related conditions.",
      color: "bg-cyan-500",
    },
  ];

  return (
    <section className="py-24 bg-background" id="specialities">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <div className="mb-4 inline-flex items-center rounded-full bg-accent-light px-4 py-2 text-sm font-medium text-accent">
            <Stethoscope className="mr-2 h-4 w-4" />
            Medical Specialities
          </div>
          <h2 className="mb-6 text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
            Comprehensive Healthcare Services
          </h2>
          <div className="w-24 h-1 bg-gradient-medical mx-auto mb-6"></div>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Our team of specialists provides expert care across multiple medical disciplines, 
            ensuring comprehensive treatment for all your healthcare needs.
          </p>
        </div>

        {/* Specialities Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {specialities.map((speciality, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-hover transition-all duration-300 border-card-border hover:-translate-y-2 cursor-pointer"
            >
              <CardContent className="p-6 text-center h-full flex flex-col">
                <div className="mb-6 mx-auto">
                  <div className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl ${speciality.color} text-white shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                    <speciality.icon className="h-8 w-8" />
                  </div>
                </div>
                <h3 className="mb-3 text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                  {speciality.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                  {speciality.description}
                </p>
                <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ArrowRight className="h-5 w-5 text-primary mx-auto" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="bg-gradient-medical border-0 shadow-medical">
            <CardContent className="p-8 lg:p-12">
              <div className="mx-auto max-w-2xl text-center text-white">
                <h3 className="mb-4 text-2xl font-bold lg:text-3xl">
                  Need Specialized Medical Care?
                </h3>
                <p className="mb-6 text-lg opacity-90">
                  Our expert specialists are here to provide you with the best possible care. 
                  Schedule a consultation today.
                </p>
                <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 sm:justify-center">
                  <Button 
                    size="lg" 
                    className="bg-accent hover:bg-accent/90 text-white shadow-hover"
                  >
                    Book Consultation
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-white/30 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
                  >
                    View All Services
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default SpecialitiesSection;