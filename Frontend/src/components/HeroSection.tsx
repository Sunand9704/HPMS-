import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ArrowRight, Heart, Shield, Users } from "lucide-react";
import heroMedical from "@/assets/hero-medical.jpg";
import hospitalExterior from "@/assets/hospital-exterior.jpg";
import medicalTeam from "@/assets/medical-team.jpg";

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: heroMedical,
      title: "The Future of Critical Care is Here",
      subtitle: "We're Changing the Way the World Thinks About Health Care",
      description: "Advanced medical technology combined with compassionate care for better health outcomes.",
    },
    {
      image: hospitalExterior,
      title: "State-of-the-Art Medical Facility",
      subtitle: "World-Class Infrastructure for Comprehensive Healthcare",
      description: "Modern equipment and facilities designed for patient comfort and medical excellence.",
    },
    {
      image: medicalTeam,
      title: "Expert Medical Professionals",
      subtitle: "Experienced Doctors and Healthcare Specialists",
      description: "Our dedicated team of medical experts ensures the highest quality of patient care.",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative h-screen overflow-hidden" id="home">
      {/* Carousel */}
      <div className="relative h-full">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <div
              className="h-full w-full bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            />
            <div className="absolute inset-0 bg-gradient-hero" />
          </div>
        ))}

        {/* Content */}
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="mb-6 flex items-center space-x-4 text-white/90">
                <div className="flex items-center space-x-2">
                  <Heart className="h-5 w-5 text-accent" />
                  <span className="text-sm font-medium">Excellence in Healthcare</span>
                </div>
                <div className="h-1 w-1 rounded-full bg-white/50" />
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-accent" />
                  <span className="text-sm font-medium">Trusted Care</span>
                </div>
              </div>

              <h1 className="mb-6 text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl animate-fade-in">
                {slides[currentSlide].title}
              </h1>
              
              <p className="mb-4 text-xl text-accent font-semibold animate-fade-in">
                {slides[currentSlide].subtitle}
              </p>
              
              <p className="mb-8 text-lg text-white/90 max-w-2xl animate-fade-in">
                {slides[currentSlide].description}
              </p>

              <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 animate-fade-in">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-white shadow-hover">
                  Learn More About Us
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
                >
                  <Users className="mr-2 h-5 w-5" />
                  Book an Appointment
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-3 text-white backdrop-blur-sm transition-all hover:bg-white/30 hover:shadow-lg"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-3 text-white backdrop-blur-sm transition-all hover:bg-white/30 hover:shadow-lg"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-3 w-3 rounded-full transition-all ${
                index === currentSlide
                  ? "bg-accent shadow-lg"
                  : "bg-white/30 hover:bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;