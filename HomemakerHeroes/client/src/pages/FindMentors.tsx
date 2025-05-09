import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Mentor } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

export default function FindMentors() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("all");
  
  const { data: mentors, isLoading } = useQuery({
    queryKey: ['/api/mentors'],
  });
  
  const getRecommendationsMutation = useMutation({
    mutationFn: async (userData: any) => {
      const res = await apiRequest("POST", "/api/ai/mentor-recommendations", userData);
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
        description: "Failed to get mentor recommendations. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  const handleGetRecommendations = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to get personalized recommendations.",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, you would gather this data from the user profile
    getRecommendationsMutation.mutate({
      skills: ["baking", "organizing", "teaching"],
      interests: ["growing business", "marketing", "product development"],
      goals: ["increase revenue", "expand product line", "build online presence"]
    });
  };
  
  const specialties = [
    { value: "all", label: "All Specialties" },
    { value: "baking", label: "Baking & Culinary" },
    { value: "crafts", label: "Arts & Crafts" },
    { value: "marketing", label: "Marketing & Branding" },
    { value: "business", label: "Business Strategy" },
    { value: "ecommerce", label: "E-commerce" }
  ];
  
  const filteredMentors = mentors?.filter((mentor: Mentor) => {
    const matchesSearch = 
      mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.bio.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSpecialty = 
      specialtyFilter === "all" || 
      mentor.specialty.toLowerCase().includes(specialtyFilter.toLowerCase());
    
    return matchesSearch && matchesSpecialty;
  }) || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-neutral-800 mb-2">
          Find a Mentor
        </h1>
        <p className="text-neutral-600">
          Connect with experienced entrepreneurs who can help you grow your business
        </p>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
        <h2 className="text-xl font-semibold mb-4">Get Personalized Mentor Matches</h2>
        <p className="text-neutral-600 mb-4">
          Our AI can analyze your skills, goals, and business stage to recommend the perfect mentors for your journey.
        </p>
        <Button 
          className="bg-primary hover:bg-primary-dark text-white"
          onClick={handleGetRecommendations}
          disabled={getRecommendationsMutation.isPending}
        >
          {getRecommendationsMutation.isPending ? (
            <>Finding your matches...</>
          ) : (
            <>Find My Mentor Matches</>
          )}
        </Button>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-sm mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Input
              type="text"
              placeholder="Search mentors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"></i>
          </div>
          
          <div className="w-full md:w-64">
            <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Specialties" />
              </SelectTrigger>
              <SelectContent>
                {specialties.map((specialty) => (
                  <SelectItem key={specialty.value} value={specialty.value}>
                    {specialty.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      ) : filteredMentors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredMentors.map((mentor: Mentor) => (
            <Card key={mentor.id} className="mentor-card border border-neutral-200 hover:border-primary">
              <CardContent className="p-5">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
                    {mentor.image ? (
                      <img
                        src={mentor.image}
                        alt={mentor.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-neutral-200 flex items-center justify-center">
                        <i className="ri-user-line text-2xl text-neutral-400"></i>
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{mentor.name}</h3>
                    <p className="text-neutral-600">{mentor.specialty}</p>
                    {mentor.matchPercentage && (
                      <Badge className="mt-1 bg-primary/10 text-primary hover:bg-primary/20 border-0">
                        {mentor.matchPercentage}% match
                      </Badge>
                    )}
                  </div>
                </div>
                
                {mentor.matchReason && (
                  <div className="mb-3 bg-blue-50 border-l-4 border-blue-300 p-3 rounded-r-md">
                    <div className="flex items-start">
                      <i className="ri-ai-generate text-blue-500 mt-0.5"></i>
                      <p className="ml-2 text-sm text-blue-700">
                        {mentor.matchReason}
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center text-xs mb-3">
                  <div className="flex items-center text-accent mr-3">
                    <i className="ri-star-fill mr-0.5"></i>
                    <span>{(mentor.rating / 10).toFixed(1)}</span>
                  </div>
                  <span className="text-neutral-500">{mentor.menteeCount} mentees</span>
                </div>
                
                <p className="text-sm text-neutral-700 mb-4 line-clamp-3">
                  {mentor.bio}
                </p>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-neutral-800">
                    ${mentor.sessionPrice} / session
                  </span>
                  <Button variant="link" className="text-primary hover:text-primary-dark p-0 h-auto">
                    View profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg shadow-sm">
          <div className="mx-auto w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
            <i className="ri-user-search-line text-3xl text-neutral-400"></i>
          </div>
          <h3 className="text-xl font-semibold mb-2">No Mentors Found</h3>
          <p className="text-neutral-600 max-w-md mx-auto mb-6">
            We couldn't find any mentors matching your search criteria. Try adjusting your filters or search terms.
          </p>
          {searchTerm || specialtyFilter !== "all" ? (
            <Button 
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setSpecialtyFilter("all");
              }}
            >
              Clear Filters
            </Button>
          ) : null}
        </div>
      )}
    </div>
  );
}
