import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";

const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
});

interface RegisterFormProps {
  userType?: "homemaker" | "mentor";
}

export default function RegisterForm({ userType = "homemaker" }: RegisterFormProps) {
  const { toast } = useToast();
  const { login } = useAuth();
  const [, navigate] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      firstName: "",
      lastName: "",
    },
  });
  
  const registerMutation = useMutation({
    mutationFn: async (data: z.infer<typeof registerSchema>) => {
      // Add user type to registration data
      const registerData = {
        ...data,
        userType: userType
      };
      const res = await apiRequest("POST", "/api/auth/register", registerData);
      return res.json();
    },
    onSuccess: async (data) => {
      toast({
        title: "Registration successful",
        description: "Your account has been created successfully.",
      });
      
      // Log the user in
      const loginSuccess = await login(form.getValues().username, form.getValues().password);
      
      if (loginSuccess) {
        // Navigate based on user type
        if (userType === "homemaker") {
          navigate("/dashboard");
        } else {
          navigate("/mentor-dashboard");
        }
      }
    },
    onError: (error: any) => {
      toast({
        title: "Registration failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = (data: z.infer<typeof registerSchema>) => {
    registerMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input 
                    placeholder={userType === "homemaker" ? "Sunita" : "Raj"} 
                    className="bg-neutral-50 border-neutral-200"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input 
                    placeholder={userType === "homemaker" ? "Sharma" : "Patel"} 
                    className="bg-neutral-50 border-neutral-200"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input 
                  placeholder={userType === "homemaker" ? "homemaker123" : "mentor123"} 
                  className="bg-neutral-50 border-neutral-200"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input 
                  type="email" 
                  placeholder={userType === "homemaker" ? "homemaker@example.com" : "mentor@example.com"} 
                  className="bg-neutral-50 border-neutral-200"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="********" 
                    className="bg-neutral-50 border-neutral-200"
                    {...field} 
                  />
                </FormControl>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 text-neutral-400 hover:text-neutral-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <i className="ri-eye-off-line"></i>
                  ) : (
                    <i className="ri-eye-line"></i>
                  )}
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="pt-2">
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-primary to-primary-dark hover:opacity-90 text-white"
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending 
              ? "Creating account..." 
              : userType === "homemaker" 
                ? "Create Homemaker Account" 
                : "Create Mentor Account"
            }
          </Button>
        </div>
        
        {userType === "homemaker" && (
          <div className="relative mt-6 pt-6 text-center">
            <div className="absolute left-0 top-0 w-full border-t border-neutral-200"></div>
            <span className="relative -top-3 bg-white px-2 text-sm text-neutral-500">
              or sign up with
            </span>
            <div className="flex justify-center gap-4 mt-4">
              <Button variant="outline" size="icon" className="rounded-full w-10 h-10">
                <i className="ri-google-fill text-lg text-neutral-700"></i>
              </Button>
              <Button variant="outline" size="icon" className="rounded-full w-10 h-10">
                <i className="ri-facebook-fill text-lg text-neutral-700"></i>
              </Button>
              <Button variant="outline" size="icon" className="rounded-full w-10 h-10">
                <i className="ri-phone-fill text-lg text-neutral-700"></i>
              </Button>
            </div>
          </div>
        )}
      </form>
    </Form>
  );
}
