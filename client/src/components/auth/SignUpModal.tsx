import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X } from "lucide-react";
import { useAuth } from "@/lib/auth";

const signupSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

const SignUpModal = () => {
  const { showSignUpModal, setShowSignUpModal, setShowLoginModal, register } = useAuth();
  const [activeTab, setActiveTab] = useState<"homemaker" | "customer">("homemaker");
  const [isPending, setIsPending] = useState(false);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
    },
  });

  const onSubmit = async (data: SignupFormValues) => {
    try {
      setIsPending(true);
      const { confirmPassword, ...registerData } = data;
      await register({
        ...registerData,
        role: activeTab,
      });
    } catch (error) {
      // Error is already handled in the register function
      console.error("Registration error:", error);
    } finally {
      setIsPending(false);
    }
  };

  const switchToLogin = () => {
    setShowSignUpModal(false);
    setShowLoginModal(true);
  };

  return (
    <Dialog open={showSignUpModal} onOpenChange={setShowSignUpModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold font-heading mb-2">
            Join EmpowerHer
          </DialogTitle>
          <DialogDescription>
            Create your account to get started
          </DialogDescription>
        </DialogHeader>
        
        <Button
          variant="ghost"
          className="absolute top-4 right-4 p-0 w-8 h-8 rounded-full"
          onClick={() => setShowSignUpModal(false)}
        >
          <X className="h-4 w-4" />
        </Button>
        
        <Tabs defaultValue="homemaker" value={activeTab} onValueChange={(value) => setActiveTab(value as "homemaker" | "customer")}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="homemaker">Homemaker</TabsTrigger>
            <TabsTrigger value="customer">Customer</TabsTrigger>
          </TabsList>
          
          <TabsContent value="homemaker">
            <p className="text-sm text-muted-foreground mb-4">
              Join as a homemaker to showcase your skills, get AI-verified, and start earning.
            </p>
          </TabsContent>
          
          <TabsContent value="customer">
            <p className="text-sm text-muted-foreground mb-4">
              Join as a customer to discover and purchase from talented homemakers in your area.
            </p>
          </TabsContent>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your first name" {...field} />
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
                        <Input placeholder="Your last name" {...field} />
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
                      <Input placeholder="Choose a username" {...field} />
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
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Your email address" {...field} />
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
                    <FormControl>
                      <Input type="password" placeholder="Choose a password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Confirm your password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary-dark"
                disabled={isPending}
              >
                {isPending ? "Creating account..." : `Sign up as ${activeTab === "homemaker" ? "Homemaker" : "Customer"}`}
              </Button>
            </form>
          </Form>
        </Tabs>
        
        <div className="mt-4 text-center text-sm text-gray-600">
          <p>
            Already have an account?{" "}
            <Button variant="link" className="p-0" onClick={switchToLogin}>
              Log in
            </Button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SignUpModal;
