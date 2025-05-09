import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import SkillAssessmentForm from "@/components/forms/SkillAssessmentForm";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function SkillAssessment() {
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
        <Skeleton className="h-12 w-3/4 mx-auto mb-4" />
        <Skeleton className="h-6 w-1/2 mx-auto mb-8" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }
  
  if (!user) return null;
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-neutral-800 mb-2">
          Discover Your Marketable Skills
        </h1>
        <p className="text-neutral-600">
          Answer a few questions to help our AI identify your most valuable talents
        </p>
      </div>
      
      <Card className="border-neutral-200">
        <CardContent className="pt-6">
          <div className="mb-6 bg-blue-50 border-l-4 border-blue-300 p-4 rounded-r-md">
            <div className="flex items-start">
              <i className="ri-lightbulb-flash-line text-blue-500 mt-0.5 text-lg"></i>
              <div className="ml-2">
                <p className="text-sm text-blue-800 font-medium">How This Works</p>
                <p className="text-sm text-blue-700">
                  Our AI will analyze your answers to identify skills you may not realize are valuable in today's market. Be honest and detailed for the best results!
                </p>
              </div>
            </div>
          </div>
          
          <SkillAssessmentForm userId={user.id} />
        </CardContent>
      </Card>
    </div>
  );
}
