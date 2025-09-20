import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { DoctorFormData } from '@/schemas/doctorSchema';
import { doctorAPI } from '@/lib/api';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export function useDoctorAPI() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const createDoctor = async (doctorData: DoctorFormData): Promise<ApiResponse<any>> => {
    setIsLoading(true);
    try {
      // Prepare the data for API submission
      const submitData = {
        ...doctorData,
        certifications: doctorData.certifications?.map(cert => ({
          ...cert,
          issueDate: new Date(cert.issueDate),
          expiryDate: cert.expiryDate ? new Date(cert.expiryDate) : undefined
        }))
      };

      const result = await doctorAPI.create(submitData);

      if (result.success) {
        toast({
          title: "Success",
          description: "Doctor added successfully!",
        });
      }

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add doctor';
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });

      return {
        success: false,
        message: errorMessage,
        error: errorMessage
      };
    } finally {
      setIsLoading(false);
    }
  };

  const updateDoctor = async (id: string, doctorData: Partial<DoctorFormData>): Promise<ApiResponse<any>> => {
    setIsLoading(true);
    try {
      const result = await doctorAPI.update(id, doctorData);

      if (result.success) {
        toast({
          title: "Success",
          description: "Doctor updated successfully!",
        });
      }

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update doctor';
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });

      return {
        success: false,
        message: errorMessage,
        error: errorMessage
      };
    } finally {
      setIsLoading(false);
    }
  };

  const deleteDoctor = async (id: string): Promise<ApiResponse<any>> => {
    setIsLoading(true);
    try {
      const result = await doctorAPI.delete(id);

      if (result.success) {
        toast({
          title: "Success",
          description: "Doctor deleted successfully!",
        });
      }

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete doctor';
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });

      return {
        success: false,
        message: errorMessage,
        error: errorMessage
      };
    } finally {
      setIsLoading(false);
    }
  };

  const getDoctors = async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    specialty?: string;
    status?: string;
  }): Promise<ApiResponse<any>> => {
    setIsLoading(true);
    try {
      const result = await doctorAPI.getAll(params);
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch doctors';
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });

      return {
        success: false,
        message: errorMessage,
        error: errorMessage
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    createDoctor,
    updateDoctor,
    deleteDoctor,
    getDoctors
  };
}
