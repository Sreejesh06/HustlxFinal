import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";

const loginSchema = z.object({
  username: z.string().min(1, "Username or Email is required"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

interface LoginFormProps {
  userType?: "homemaker" | "mentor";
}

export default function LoginForm({ userType = "homemaker" }: LoginFormProps) {
  const { login } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
      rememberMe: true,
    },
  });
  
  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    setIsLoggingIn(true);
    
    try {
      const success = await login(data.username, data.password);
      
      if (success) {
        // Navigate based on user type
        if (userType === "homemaker") {
          navigate("/dashboard");
        } else {
          navigate("/mentor-dashboard");
        }
      } else {
        toast({
          title: "Login failed",
          description: "Invalid username or password. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email or Mobile</FormLabel>
              <FormControl>
                <Input 
                  placeholder={userType === "homemaker" ? "homemaker@example.com" : "mentor@example.com"} 
                  autoComplete="username"
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
                    autoComplete="current-password"
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
        
        <div className="flex items-center justify-between">
          <FormField
            control={form.control}
            name="rememberMe"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2 space-y-0">
                <FormControl>
                  <Checkbox 
                    checked={field.value} 
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="text-sm font-normal cursor-pointer">Remember me</FormLabel>
              </FormItem>
            )}
          />
          
          <Button 
            variant="link" 
            className="text-sm text-neutral-600 hover:text-primary p-0 h-auto"
          >
            Forgot password?
          </Button>
        </div>
        
        <div className="pt-2">
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-primary to-primary-dark hover:opacity-90 text-white"
            disabled={isLoggingIn}
          >
            {isLoggingIn ? "Logging in..." : userType === "homemaker" ? "Login as Homemaker" : "Login as Mentor"}
          </Button>
        </div>
        
        {userType === "homemaker" && (
          <div className="relative mt-6 pt-6 text-center">
            <div className="absolute left-0 top-0 w-full border-t border-neutral-200"></div>
            <span className="relative -top-3 bg-white px-2 text-sm text-neutral-500">
              or continue with
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
