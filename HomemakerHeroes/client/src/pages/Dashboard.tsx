import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useLocation } from "wouter";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import SkillSuggestionSection from "@/components/dashboard/SkillSuggestionSection";
import MarketplaceSection from "@/components/dashboard/MarketplaceSection";
import SidebarContent from "@/components/dashboard/SidebarContent";
import SuccessStoriesSection from "@/components/dashboard/SuccessStoriesSection";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated, isLoading } = useAuth();
  
  const { data: skillSuggestions, isLoading: isSuggestionsLoading } = useQuery({
    queryKey: [user ? `/api/users/${user.id}/skill-suggestions` : null],
    enabled: !!user,
  });
  
  const { data: listings, isLoading: isListingsLoading } = useQuery({
    queryKey: [user ? `/api/users/${user.id}/listings` : null],
    enabled: !!user,
  });
  
  const { data: mentors, isLoading: isMentorsLoading } = useQuery({
    queryKey: ['/api/mentors'],
  });
  
  const { data: successStories, isLoading: isStoriesLoading } = useQuery({
    queryKey: ['/api/success-stories'],
  });
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation("/login");
    }
  }, [isLoading, isAuthenticated, setLocation]);
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-20 w-full mb-8" />
        <Skeleton className="h-64 w-full mb-10" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Skeleton className="h-96 w-full mb-6" />
            <Skeleton className="h-64 w-full" />
          </div>
          <div>
            <Skeleton className="h-64 w-full mb-6" />
            <Skeleton className="h-64 w-full mb-6" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }
  
  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <DashboardHeader 
        user={user} 
        profileCompletion={user.profileCompletionPercentage || 65} 
      />
      
      <SkillSuggestionSection 
        suggestions={skillSuggestions || []} 
        isLoading={isSuggestionsLoading} 
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MarketplaceSection 
            listings={listings || []} 
            isLoading={isListingsLoading} 
          />
        </div>
        
        <div className="space-y-6">
          <SidebarContent 
            user={user}
            mentors={mentors || []}
            isLoading={isMentorsLoading}
          />
        </div>
      </div>
      
      <SuccessStoriesSection 
        stories={successStories || []}
        isLoading={isStoriesLoading}
      />
    </div>
  );
}
