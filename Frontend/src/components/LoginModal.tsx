import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, User, Phone, Stethoscope, CheckCircle, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { patientApi, PatientRegistrationData, authApi, LoginData } from "@/lib/api";
import { usePatientAuth } from "@/contexts/PatientAuthContext";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  const [activeTab, setActiveTab] = useState("login");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  
  // Login form state
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    role: ""
  });
  
  // Register form state
  const [registerData, setRegisterData] = useState({
    name: "",
    age: "",
    gender: "",
    email: "",
    phone: ""
  });

  const { toast } = useToast();
  const { login } = usePatientAuth();

  const handleLoginInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
    setError("");
  };

  const handleLoginSelectChange = (field: string, value: string) => {
    setLoginData(prev => ({
      ...prev,
      [field]: value
    }));
    setError("");
  };

  const handleRegisterInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setRegisterData(prev => ({
      ...prev,
      [name]: value
    }));
    setError("");
  };

  const handleSelectChange = (field: string, value: string) => {
    setRegisterData(prev => ({
      ...prev,
      [field]: value
    }));
    setError("");
  };

  const validateRegisterForm = () => {
    if (!registerData.name || !registerData.age || !registerData.gender || !registerData.email || !registerData.phone) {
      setError("Please fill in all required fields");
      return false;
    }

    const age = parseInt(registerData.age);
    if (isNaN(age) || age < 0 || age > 150) {
      setError("Please enter a valid age (0-150)");
      return false;
    }

    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(registerData.email)) {
      setError("Please enter a valid email address");
      return false;
    }

    if (!/^[\+]?[1-9][\d]{0,15}$/.test(registerData.phone)) {
      setError("Please enter a valid phone number");
      return false;
    }

    if (!acceptTerms) {
      setError("Please accept the terms and conditions");
      return false;
    }

    return true;
  };

  const validateLoginForm = () => {
    if (!loginData.email || !loginData.password || !loginData.role) {
      setError("Please fill in all required fields");
      return false;
    }

    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(loginData.email)) {
      setError("Please enter a valid email address");
      return false;
    }

    if (loginData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }

    return true;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!validateLoginForm()) {
      setIsLoading(false);
      return;
    }

    try {
      const loginCredentials: LoginData = {
        email: loginData.email,
        password: loginData.password,
        role: loginData.role as 'Doctor' | 'Patient'
      };

      const response = await authApi.login(loginCredentials);
      
      if (response.success && response.data) {
        // Handle successful login based on role
        if (loginData.role === "Patient") {
          // For patient login, we'll use the same login function as registration
          login(response.data.user || response.data.patient, response.data.token);
          
          toast({
            title: "Login Successful",
            description: `Welcome back, ${response.data.user?.name || response.data.patient?.name}!`,
          });
          
          onClose();
        } else if (loginData.role === "Doctor") {
          // For doctor login, we'll handle it differently
          toast({
            title: "Login Successful",
            description: `Welcome back, Dr. ${response.data.user?.name}!`,
          });
          
          onClose();
        }
      } else {
        setError(response.message || "Login failed. Please try again.");
      }
      
    } catch (err: any) {
      console.error('Login error:', err);
      
      if (err.message?.includes('Invalid credentials')) {
        setError("Invalid email or password. Please try again.");
      } else if (err.message?.includes('User not found')) {
        setError("No account found with this email address.");
      } else {
        setError("Login failed. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!validateRegisterForm()) {
      setIsLoading(false);
      return;
    }

    try {
      const registrationData: PatientRegistrationData = {
        name: registerData.name,
        age: parseInt(registerData.age),
        gender: registerData.gender as 'Male' | 'Female' | 'Other',
        email: registerData.email,
        phone: registerData.phone
      };

      const response = await patientApi.register(registrationData);
      
      if (response.success && response.data) {
        login(response.data.patient, response.data.token);
        
        toast({
          title: "Registration Successful",
          description: `Welcome ${response.data.patient.name}! Your patient account has been created successfully.`,
        });
        
        onClose();
      } else {
        setError(response.message || "Registration failed. Please try again.");
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      
      if (err.message?.includes('already exists')) {
        setError("A patient with this email already exists. Please use a different email.");
      } else if (err.message?.includes('Validation failed')) {
        setError("Please check your information and try again.");
      } else {
        setError("Registration failed. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-gray-900">
            <Stethoscope className="mx-auto h-8 w-8 text-blue-600 mb-2" />
            Delta Hospitals
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600">
            Access your patient account or register as a new patient
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="login-role" className="text-sm font-medium text-gray-700">
                  Role *
                </Label>
                <select
                  id="login-role"
                  value={loginData.role}
                  onChange={(e) => handleLoginSelectChange('role', e.target.value)}
                  className="w-full h-11 px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select your role</option>
                  <option value="Doctor">Doctor</option>
                  <option value="Patient">Patient</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-email" className="text-sm font-medium text-gray-700">
                  Email Address *
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="login-email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={loginData.email}
                    onChange={handleLoginInputChange}
                    className="pl-10 h-11"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password" className="text-sm font-medium text-gray-700">
                  Password *
                </Label>
                <Input
                  id="login-password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={loginData.password}
                  onChange={handleLoginInputChange}
                  className="h-11"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-gradient-medical hover:shadow-hover transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register" className="space-y-4">
            <form onSubmit={handleRegister} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-name" className="text-sm font-medium text-gray-700">
                    Full Name *
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="register-name"
                      name="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={registerData.name}
                      onChange={handleRegisterInputChange}
                      className="pl-10 h-11"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-age" className="text-sm font-medium text-gray-700">
                      Age *
                    </Label>
                    <Input
                      id="register-age"
                      name="age"
                      type="number"
                      placeholder="Age"
                      value={registerData.age}
                      onChange={handleRegisterInputChange}
                      className="h-11"
                      min="0"
                      max="150"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-gender" className="text-sm font-medium text-gray-700">
                      Gender *
                    </Label>
                    <select
                      id="register-gender"
                      value={registerData.gender}
                      onChange={(e) => handleSelectChange('gender', e.target.value)}
                      className="w-full h-11 px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-email" className="text-sm font-medium text-gray-700">
                    Email Address *
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="register-email"
                      name="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={registerData.email}
                      onChange={handleRegisterInputChange}
                      className="pl-10 h-11"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-phone" className="text-sm font-medium text-gray-700">
                    Phone Number *
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="register-phone"
                      name="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={registerData.phone}
                      onChange={handleRegisterInputChange}
                      className="pl-10 h-11"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="accept-terms"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <Label htmlFor="accept-terms" className="text-sm text-gray-600">
                  I agree to the{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    Terms and Conditions
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </a>
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-gradient-medical hover:shadow-hover transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? "Registering..." : "Register as Patient"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
