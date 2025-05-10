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
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginModal = () => {
  const { showLoginModal, setShowLoginModal, setShowSignUpModal, login } = useAuth();
  const [activeTab, setActiveTab] = useState<"homemaker" | "customer">("homemaker");
  const [isPending, setIsPending] = useState(false);
  const { toast } = useToast();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setIsPending(true);
      await login(data.email, data.password);
    } catch (error) {
      // Error is already handled in the login function
      console.error("Login error:", error);
    } finally {
      setIsPending(false);
    }
  };

  const switchToSignUp = () => {
    setShowLoginModal(false);
    setShowSignUpModal(true);
  };

  return (
    <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold font-heading mb-2">
            Log In to EmpowerHer
          </DialogTitle>
          <DialogDescription>
            Enter your credentials to access your account
          </DialogDescription>
        </DialogHeader>
        
        <Button
          variant="ghost"
          className="absolute top-4 right-4 p-0 w-8 h-8 rounded-full"
          onClick={() => setShowLoginModal(false)}
        >
          <X className="h-4 w-4" />
        </Button>
        
        <Tabs defaultValue="homemaker" value={activeTab} onValueChange={(value) => setActiveTab(value as "homemaker" | "customer")}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="homemaker">Homemaker</TabsTrigger>
            <TabsTrigger value="customer">Customer</TabsTrigger>
          </TabsList>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                    <div className="flex items-center justify-between">
                      <FormLabel>Password</FormLabel>
                      <Button 
                        variant="link" 
                        className="text-xs p-0 h-auto font-normal"
                        type="button"
                        onClick={() => toast({
                          title: "Password reset",
                          description: "This feature is coming soon!"
                        })}
                      >
                        Forgot password?
                      </Button>
                    </div>
                    <FormControl>
                      <Input type="password" placeholder="Your password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="rememberMe"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox 
                        checked={field.value} 
                        onCheckedChange={field.onChange}
                        id="rememberMe"
                      />
                    </FormControl>
                    <FormLabel htmlFor="rememberMe" className="text-sm font-normal cursor-pointer">
                      Remember me
                    </FormLabel>
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary-dark"
                disabled={isPending}
              >
                {isPending ? "Logging in..." : "Log In"}
              </Button>
            </form>
          </Form>
        </Tabs>
        
        <div className="mt-4 text-center text-sm text-gray-600">
          <p>
            Don't have an account?{" "}
            <Button variant="link" className="p-0" onClick={switchToSignUp}>
              Sign up
            </Button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
