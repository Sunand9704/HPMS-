import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  Heart,
  ArrowRight
} from "lucide-react";

const Footer = () => {
  const quickLinks = [
    { name: "About Us", href: "#about" },
    { name: "Specialities", href: "#specialities" },
    { name: "Meet Our Doctors", href: "#doctors" },
    { name: "Health Packages", href: "#packages" },
    { name: "Patient Portal", href: "#portal" },
    { name: "Insurance", href: "#insurance" },
  ];

  const services = [
    { name: "Emergency Care", href: "#emergency" },
    { name: "Critical Care", href: "#critical" },
    { name: "Surgery", href: "#surgery" },
    { name: "Diagnostics", href: "#diagnostics" },
    { name: "Pharmacy", href: "#pharmacy" },
    { name: "Ambulance", href: "#ambulance" },
  ];

  const legalLinks = [
    { name: "Privacy Policy", href: "#privacy" },
    { name: "Terms of Service", href: "#terms" },
    { name: "Sitemap", href: "#sitemap" },
    { name: "Patient Rights", href: "#rights" },
  ];

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
  ];

  return (
    <footer className="bg-primary text-primary-foreground" id="contact">
      {/* Main Footer */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid lg:grid-cols-4 gap-8 mb-12">
          {/* Hospital Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-6">
              <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold">Delta</span>
                <span className="text-sm opacity-90 -mt-1">HOSPITALS</span>
              </div>
            </div>
            <p className="text-sm opacity-90 leading-relaxed mb-6">
              Providing exceptional healthcare services with cutting-edge medical 
              technology and compassionate care. Your health is our priority.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-white hover:bg-accent hover:text-white transition-all duration-300 hover:scale-110"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-sm opacity-90 hover:opacity-100 hover:text-accent transition-all duration-300 flex items-center group"
                  >
                    <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Our Services</h3>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <li key={index}>
                  <a
                    href={service.href}
                    className="text-sm opacity-90 hover:opacity-100 hover:text-accent transition-all duration-300 flex items-center group"
                  >
                    <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {service.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Contact Information</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <div className="text-sm opacity-90">
                  <p className="font-medium">Delta Hospitals</p>
                  <p>123 Medical Plaza, Health Street</p>
                  <p>Rajahmundry, Andhra Pradesh 533101</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-accent flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium opacity-90">Emergency: +91 123 456 7890</p>
                  <p className="opacity-75">General: +91 123 456 7891</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-accent flex-shrink-0" />
                <div className="text-sm opacity-90">
                  <p>info@deltahospitals.com</p>
                  <p>emergency@deltahospitals.com</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <div className="text-sm opacity-90">
                  <p className="font-medium">Emergency: 24/7</p>
                  <p>OPD: 9:00 AM - 8:00 PM</p>
                  <p>Visiting Hours: 10:00 AM - 7:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency CTA */}
        <div className="bg-accent/10 rounded-2xl p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="text-center sm:text-left mb-4 sm:mb-0">
              <h4 className="text-lg font-semibold text-accent mb-2">24/7 Emergency Services</h4>
              <p className="text-sm opacity-90">
                Need immediate medical attention? Our emergency team is ready to help.
              </p>
            </div>
            <Button className="bg-accent hover:bg-accent/90 text-white shadow-hover">
              <Phone className="mr-2 h-4 w-4" />
              Call Emergency: +91 123 456 7890
            </Button>
          </div>
        </div>

        <Separator className="bg-white/20 mb-8" />

        {/* Bottom Footer */}
        <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
          <div className="text-center lg:text-left">
            <p className="text-sm opacity-90">
              © 2024 Delta Hospitals. All rights reserved.
            </p>
            <p className="text-xs opacity-75 mt-1">
              Committed to excellence in healthcare since 2010
            </p>
          </div>
          
          <div className="flex flex-wrap items-center justify-center space-x-6">
            {legalLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="text-xs opacity-75 hover:opacity-100 hover:text-accent transition-all duration-300"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;