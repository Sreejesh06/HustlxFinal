import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import LoginForm from "@/components/auth/LoginForm";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Login() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, isLoading } = useAuth();
  const [userType, setUserType] = useState<"homemaker" | "mentor">("homemaker");
  
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      if (userType === "homemaker") {
        setLocation("/dashboard");
      } else {
        setLocation("/mentor-dashboard");
      }
    }
  }, [isLoading, isAuthenticated, setLocation, userType]);
  
  return (
    <div className="container mx-auto px-4 py-12 md:max-w-5xl">
      <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-center">
        <div className="hidden md:block w-full md:w-1/2">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-transparent rounded-xl"></div>
            <img 
              src="https://images.unsplash.com/photo-1607453998774-d533f65dac99?q=80&w=800&auto=format&fit=crop"
              alt="Indian women entrepreneurs" 
              className="rounded-xl shadow-lg w-full object-cover h-[500px]"
            />
            <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg max-w-[80%]">
              <h3 className="font-bold text-neutral-800 text-lg">Empowering Homemakers Across India</h3>
              <p className="text-neutral-600 text-sm mt-1">Discover your skills, monetize your talent, achieve financial independence</p>
            </div>
          </div>
        </div>
        
        <div className="w-full md:w-1/2">
          <div className="flex justify-center mb-8">
            <div className="w-12 h-12 rounded-md bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg">
              <i className="ri-settings-line text-white text-2xl"></i>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-center mb-8">
            <span className="bg-gradient-to-r from-primary to-primary-dark text-white px-4 py-2 rounded-md shadow-md">
              Hustlx
            </span>
          </h1>
      
          <Tabs defaultValue="homemaker" onValueChange={(value) => setUserType(value as "homemaker" | "mentor")} className="w-full mb-6">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="homemaker" className="text-base">Homemaker</TabsTrigger>
              <TabsTrigger value="mentor" className="text-base">Mentor/Investor</TabsTrigger>
            </TabsList>
            
            <TabsContent value="homemaker">
              <Card className="border-neutral-200">
                <CardContent className="pt-6">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-neutral-800 mb-2">Welcome Homemaker</h2>
                    <p className="text-neutral-600">Log in to discover and monetize your skills</p>
                  </div>
                  
                  <LoginForm userType="homemaker" />
                  
                  <div className="text-center mt-6">
                    <p className="text-sm text-neutral-600">
                      Don't have an account?{" "}
                      <a 
                        href="/register" 
                        className="text-primary hover:text-primary-dark font-medium"
                        onClick={(e) => {
                          e.preventDefault();
                          setLocation("/register");
                        }}
                      >
                        Sign up
                      </a>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="mentor">
              <Card className="border-neutral-200">
                <CardContent className="pt-6">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-neutral-800 mb-2">Mentor/Investor Login</h2>
                    <p className="text-neutral-600">Log in to connect with talented homemakers</p>
                  </div>
                  
                  <LoginForm userType="mentor" />
                  
                  <div className="text-center mt-6">
                    <p className="text-sm text-neutral-600">
                      Want to become a mentor?{" "}
                      <a 
                        href="/register" 
                        className="text-primary hover:text-primary-dark font-medium"
                        onClick={(e) => {
                          e.preventDefault();
                          setLocation("/register");
                        }}
                      >
                        Sign up
                      </a>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="text-center mt-8">
            <p className="text-sm text-neutral-500">
              By logging in, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
