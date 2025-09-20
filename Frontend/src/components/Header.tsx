import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Phone, Calendar } from "lucide-react";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navigationItems = [
    { name: "Home", href: "#home" },
    { name: "About Us", href: "#about" },
    { name: "Specialities", href: "#specialities" },
    { name: "Meet Our Doctors", href: "#doctors" },
    { name: "Health Packages", href: "#packages" },
    { name: "Careers", href: "#careers" },
    { name: "Contact Us", href: "#contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-card-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="h-10 w-10 rounded-lg bg-gradient-medical flex items-center justify-center shadow-medical">
              <div className="h-6 w-6 rounded bg-background flex items-center justify-center">
                <div className="h-3 w-3 rounded bg-primary"></div>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-primary"></span>
              <span className="text-xs text-muted-foreground -mt-1">HOSPITALS</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-foreground hover:text-primary transition-colors relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center space-x-3">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
              <Phone className="mr-2 h-4 w-4" />
              Emergency: +91 123 456 7890
            </Button>
            <Button className="bg-gradient-medical hover:shadow-hover transition-all duration-300">
              <Calendar className="mr-2 h-4 w-4" />
              Book an Appointment
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col space-y-6 pt-6">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-lg bg-gradient-medical flex items-center justify-center">
                    <div className="h-4 w-4 rounded bg-background flex items-center justify-center">
                      <div className="h-2 w-2 rounded bg-primary"></div>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-primary">NeoMedix Hospitals</span>
                  </div>
                </div>
                
                <nav className="flex flex-col space-y-4">
                  {navigationItems.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="text-foreground hover:text-primary transition-colors py-2 border-b border-border/50"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </a>
                  ))}
                </nav>

                <div className="space-y-3 pt-4">
                  <Button variant="outline" className="w-full justify-start">
                    <Phone className="mr-2 h-4 w-4" />
                    Emergency: +91 123 456 7890
                  </Button>
                  <Button className="w-full bg-gradient-medical">
                    <Calendar className="mr-2 h-4 w-4" />
                    Book an Appointment
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;