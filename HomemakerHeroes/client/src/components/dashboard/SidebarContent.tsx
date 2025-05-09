import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Mentor } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

interface SidebarContentProps {
  user: User;
  mentors: Mentor[];
  isLoading: boolean;
}

export default function SidebarContent({
  user,
  mentors,
  isLoading
}: SidebarContentProps) {
  const { toast } = useToast();
  
  const { data: skills = [] } = useQuery({
    queryKey: [`/api/users/${user.id}/skills`],
  });
  
  const getMentorRecommendationsMutation = useMutation({
    mutationFn: async () => {
      // Using skills data for recommendations if available
      const userSkills = Array.isArray(skills) ? skills.map((skill: any) => skill.name) : ["baking", "organizing", "teaching"];
      
      const res = await apiRequest("POST", "/api/ai/mentor-recommendations", {
        skills: userSkills,
        interests: ["growing business", "marketing", "product development"],
        goals: ["increase revenue", "expand product line", "build online presence"]
      });
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Mentor recommendations updated",
        description: "We've found the best mentors for your needs!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to get personalized mentor recommendations.",
        variant: "destructive",
      });
    },
  });
  
  // Filter mentors to show only the top 2
  const topMentors = mentors?.slice(0, 2) || [];
  
  if (isLoading) {
    return (
      <>
        <Skeleton className="h-64 w-full mb-6" />
        <Skeleton className="h-64 w-full mb-6" />
        <Skeleton className="h-64 w-full" />
      </>
    );
  }

  return (
    <>
      {/* Profile Completion Card */}
      <Card className="shadow-sm border-neutral-200">
        <CardContent className="p-5">
          <h2 className="text-lg font-headings font-semibold text-neutral-800 mb-3">Complete Your Profile</h2>
          <p className="text-sm text-neutral-600 mb-4">A complete profile gets 5x more customer interest!</p>
          
          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <i className="ri-check-line text-green-500 p-1 bg-green-100 rounded-full text-xs mr-2"></i>
                <span className="text-sm text-neutral-700">Basic info</span>
              </div>
              <span className="text-xs text-green-600">Completed</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <i className={`ri-${user.profileImage ? 'check' : 'time'}-line text-${user.profileImage ? 'green' : 'orange'}-500 p-1 bg-${user.profileImage ? 'green' : 'orange'}-100 rounded-full text-xs mr-2`}></i>
                <span className="text-sm text-neutral-700">Profile photo</span>
              </div>
              <span className={`text-xs text-${user.profileImage ? 'green' : 'orange'}-${user.profileImage ? '600' : '500'}`}>
                {user.profileImage ? 'Completed' : 'Pending'}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <i className="ri-check-line text-green-500 p-1 bg-green-100 rounded-full text-xs mr-2"></i>
                <span className="text-sm text-neutral-700">Skills & experience</span>
              </div>
              <span className="text-xs text-green-600">Completed</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <i className="ri-time-line text-orange-500 p-1 bg-orange-100 rounded-full text-xs mr-2"></i>
                <span className="text-sm text-neutral-700">Portfolio samples</span>
              </div>
              <span className="text-xs text-orange-500">2/5 added</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <i className="ri-close-line text-neutral-400 p-1 bg-neutral-100 rounded-full text-xs mr-2"></i>
                <span className="text-sm text-neutral-700">Verify identity</span>
              </div>
              <span className="text-xs text-neutral-500">Not started</span>
            </div>
          </div>
          
          <Link href="/profile-setup">
            <Button className="w-full bg-secondary hover:bg-secondary-dark text-white">
              Continue setup
            </Button>
          </Link>
        </CardContent>
      </Card>
      
      {/* Mentorship Card */}
      <Card className="shadow-sm border-neutral-200 mt-6">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-headings font-semibold text-neutral-800">Your Mentor Match</h2>
            <span className="bg-primary-light bg-opacity-20 text-primary text-xs font-medium px-2 py-0.5 rounded">AI-Matched</span>
          </div>
          <p className="text-sm text-neutral-600 mb-4">
            We've found mentors who can help grow your business based on your goals and skills.
          </p>
          
          {isLoading ? (
            <div className="flex justify-center my-6">
              <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : topMentors.length > 0 ? (
            topMentors.map(mentor => (
              <div key={mentor.id} className="mentor-card border border-neutral-200 rounded-lg p-4 mb-3 hover:border-primary hover:shadow-md transition-all">
                <div className="flex items-center mb-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-3 bg-gradient-to-br from-primary-light to-primary flex items-center justify-center">
                    {mentor.image ? (
                      <img
                        src={mentor.image}
                        alt={mentor.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-white font-bold text-lg">
                        {mentor.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-neutral-800">{mentor.name}</h3>
                    <p className="text-sm text-neutral-600">{mentor.specialty}</p>
                  </div>
                </div>
                <div className="flex items-center text-xs mb-2">
                  <div className="flex items-center text-accent mr-3">
                    <i className="ri-star-fill mr-0.5"></i>
                    <span>{mentor.rating ? (mentor.rating / 10).toFixed(1) : '4.8'}</span>
                  </div>
                  <span className="text-neutral-500">{mentor.menteeCount || 12} mentees</span>
                </div>
                <p className="text-sm text-neutral-700 mb-3 line-clamp-3">{mentor.bio}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-neutral-800">₹{mentor.sessionPrice || 1200} / session</span>
                  <Button variant="link" className="text-primary hover:text-primary-dark p-0 h-auto">
                    View profile
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4">
              <p className="text-neutral-600 text-sm">No mentors available yet</p>
              <p className="text-xs text-neutral-500 mt-1">Click below to find matches</p>
            </div>
          )}
          
          <div className="text-center">
            <Button 
              variant="link"
              className="text-sm text-secondary hover:text-secondary-dark font-medium"
              onClick={() => getMentorRecommendationsMutation.mutate()}
              disabled={getMentorRecommendationsMutation.isPending}
            >
              {getMentorRecommendationsMutation.isPending ? (
                "Finding matches..."
              ) : (
                <>See all matches <i className="ri-arrow-right-line ml-0.5"></i></>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Micro-Loan Opportunity */}
      <Card className="shadow-sm border-neutral-200 mt-6">
        <CardContent className="p-5">
          <div className="flex items-center space-x-2 mb-3">
            <div className="bg-accent p-1.5 rounded-md">
              <i className="ri-coin-line text-white"></i>
            </div>
            <h2 className="text-lg font-headings font-semibold text-neutral-800">Funding Opportunity</h2>
          </div>
          <p className="text-sm text-neutral-600 mb-4">
            Based on your business growth, you may qualify for these micro-funding options.
          </p>
          
          <div className="border border-neutral-200 rounded-lg p-4 mb-3 bg-gradient-to-r from-accent-light/5 to-white">
            <h3 className="font-medium text-neutral-800 mb-1">Business Expansion Micro-Loan</h3>
            <div className="flex items-center text-sm mb-2">
              <span className="text-neutral-700 font-medium">₹1,25,000 - ₹2,50,000</span>
              <span className="text-neutral-500 mx-2">•</span>
              <span className="text-green-600">94% match</span>
            </div>
            <p className="text-sm text-neutral-700 mb-3">
              Low-interest loan for purchasing equipment or expanding product lines. No collateral required.
            </p>
            <div className="flex space-x-3 mt-2">
              <Button 
                className="bg-accent hover:bg-accent-dark text-accent-foreground"
                onClick={() => window.open("https://pmyuvanidhi.gov.in/", "_blank")}
              >
                Check eligibility
              </Button>
              <Button 
                variant="ghost" 
                className="text-neutral-600 hover:text-neutral-800"
                onClick={() => window.open("https://www.startupindia.gov.in/content/sih/en/government-schemes.html", "_blank")}
              >
                Learn more
              </Button>
            </div>
          </div>
          
          <div className="text-center mt-2">
            <Button variant="link" className="text-sm text-neutral-600 hover:text-neutral-800">
              View all financing options
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
