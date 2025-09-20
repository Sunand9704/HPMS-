import { Card, CardContent } from "@/components/ui/card";
import { Users, Heart, Award, Activity } from "lucide-react";

const AboutSection = () => {
  const stats = [
    {
      icon: Users,
      number: "7000+",
      label: "In Patients",
      description: "Successfully treated with care",
    },
    {
      icon: Activity,
      number: "1400+",
      label: "ICU Patients",
      description: "Critical care expertise",
    },
    {
      icon: Heart,
      number: "23000+",
      label: "Patients Registered",
      description: "Trust us with their health",
    },
    {
      icon: Award,
      number: "600+",
      label: "Surgeries",
      description: "Performed with precision",
    },
  ];

  return (
    <section className="py-24 bg-gradient-card" id="about">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <div className="mb-4 inline-flex items-center rounded-full bg-medical-blue-light px-4 py-2 text-sm font-medium text-primary">
            <Heart className="mr-2 h-4 w-4" />
            About Delta Hospitals
          </div>
          <h2 className="mb-6 text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
            Best Multispeciality Hospital in Rajahmundry
          </h2>
          <div className="w-24 h-1 bg-gradient-medical mx-auto mb-6"></div>
          <p className="text-lg text-muted-foreground leading-relaxed">
            At Delta Hospitals, we are committed to providing exceptional healthcare services 
            with cutting-edge medical technology and compassionate care. Our mission is to 
            deliver world-class treatment while maintaining the highest standards of medical ethics.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-primary mb-4 flex items-center">
                <div className="w-1 h-8 bg-accent mr-4"></div>
                Our Mission
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                To provide comprehensive, high-quality healthcare services that promote 
                healing, enhance well-being, and improve the quality of life for our 
                patients and their families through innovative medical practices and 
                compassionate care.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-primary mb-4 flex items-center">
                <div className="w-1 h-8 bg-accent mr-4"></div>
                Our Vision
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                The Future of Critical Care is Here. We're Changing the Way the World 
                Thinks About Health Care by integrating advanced technology with 
                personalized patient care to create a new standard of excellence in healthcare.
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-medical rounded-2xl transform rotate-3"></div>
            <Card className="relative bg-background shadow-card border-card-border">
              <CardContent className="p-8">
                <h4 className="text-xl font-bold text-primary mb-4">Why Choose Delta Hospitals?</h4>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    Advanced medical technology and equipment
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    Experienced team of medical professionals
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    24/7 emergency and critical care services
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    Patient-centered approach to healthcare
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    Comprehensive range of medical specialities
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="group hover:shadow-hover transition-all duration-300 border-card-border hover:-translate-y-1">
              <CardContent className="p-6 text-center">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-medical text-white shadow-medical group-hover:shadow-hover transition-all duration-300">
                  <stat.icon className="h-8 w-8" />
                </div>
                <div className="mb-2 text-3xl font-bold text-primary">{stat.number}</div>
                <div className="mb-2 text-lg font-semibold text-foreground">{stat.label}</div>
                <p className="text-sm text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;