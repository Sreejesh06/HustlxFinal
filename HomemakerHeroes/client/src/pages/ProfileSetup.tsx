import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import ProfileForm from "@/components/forms/ProfileForm";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileSetup() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated, isLoading } = useAuth();
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation("/login");
    }
  }, [isLoading, isAuthenticated, setLocation]);
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Skeleton className="h-12 w-3/4 mx-auto mb-8" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }
  
  if (!user) return null;
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-neutral-800 mb-2">
          Complete Your Profile
        </h1>
        <p className="text-neutral-600">
          A complete profile increases your visibility and helps connect you with opportunities
        </p>
      </div>
      
      <Card className="border-neutral-200">
        <CardContent className="pt-6">
          <Tabs defaultValue="basic-info" className="w-full">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
              <TabsTrigger value="skills">Skills & Experience</TabsTrigger>
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic-info">
              <ProfileForm user={user} section="basic" />
            </TabsContent>
            
            <TabsContent value="skills">
              <ProfileForm user={user} section="skills" />
            </TabsContent>
            
            <TabsContent value="portfolio">
              <ProfileForm user={user} section="portfolio" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="text-center mt-6">
        <p className="text-sm text-neutral-600">
          Want to discover your marketable skills first?{" "}
          <a 
            href="/skill-assessment" 
            className="text-primary hover:text-primary-dark font-medium"
            onClick={(e) => {
              e.preventDefault();
              setLocation("/skill-assessment");
            }}
          >
            Take the skill assessment
          </a>
        </p>
      </div>
    </div>
  );
}
