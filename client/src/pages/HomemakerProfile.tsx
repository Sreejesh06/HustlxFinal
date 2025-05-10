import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams, useLocation } from "wouter";
import { Helmet } from "react-helmet";
import { 
  MapPin, 
  Mail, 
  Phone, 
  Calendar, 
  Star, 
  Clock,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import SkillBadge from "@/components/skills/SkillBadge";
import ListingCard from "@/components/marketplace/ListingCard";
import ReviewsDisplay from "@/components/dashboard/ReviewsDisplay";
import { useAuth } from "@/lib/auth";

export default function HomemakerProfile() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("listings");
  
  // Parse the ID to number
  const homemakerId = parseInt(id!);
  
  // Redirect to dashboard if viewing own profile
  useEffect(() => {
    if (isAuthenticated && user?.id === homemakerId && user?.role === "homemaker") {
      setLocation("/dashboard");
    }
  }, [isAuthenticated, user, homemakerId, setLocation]);
  
  // Fetch homemaker data
  const { data: homemaker, isLoading: isHomemakerLoading } = useQuery({
    queryKey: [`/api/users/${homemakerId}`],
    enabled: !!homemakerId && (!isAuthenticated || user?.id !== homemakerId),
  });
  
  // Fetch homemaker skills
  const { data: skills, isLoading: isSkillsLoading } = useQuery({
    queryKey: [`/api/homemakers/${homemakerId}/skills`],
    enabled: !!homemakerId,
  });
  
  // Fetch homemaker listings
  const { data: listings, isLoading: isListingsLoading } = useQuery({
    queryKey: [`/api/homemakers/${homemakerId}/listings`],
    enabled: !!homemakerId,
  });
  
  // Fetch homemaker reviews
  const { data: reviews, isLoading: isReviewsLoading } = useQuery({
    queryKey: [`/api/reviews/recipient/${homemakerId}`],
    enabled: !!homemakerId,
  });
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
    }).format(date);
  };
  
  // Calculate average rating
  const averageRating = reviews?.length
    ? reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / reviews.length
    : 0;
  
  // Calculate number of verified skills
  const verifiedSkillsCount = skills?.filter((skill: any) => skill.isVerified).length || 0;
  
  return (
    <>
      <Helmet>
        <title>
          {isHomemakerLoading
            ? "Loading Profile... | EmpowerHer"
            : `${homemaker?.username || `Homemaker #${homemakerId}`} | EmpowerHer`}
        </title>
        <meta
          name="description"
          content={`View ${homemaker?.username || "this homemaker's"} profile, services and verified skills on EmpowerHer.`}
        />
      </Helmet>
      
      <div className="container px-4 py-8 mx-auto max-w-7xl">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-6 sm:p-8">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar and Basic Info */}
              <div className="md:w-1/3 flex flex-col items-center md:items-start">
                {isHomemakerLoading ? (
                  <Skeleton className="w-32 h-32 rounded-full" />
                ) : (
                  <Avatar className="w-32 h-32 border-4 border-primary/10">
                    <AvatarImage src={homemaker?.profilePicture} alt={homemaker?.username} />
                    <AvatarFallback className="text-3xl">
                      {homemaker?.username?.[0]?.toUpperCase() || "H"}
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div className="mt-4 text-center md:text-left">
                  {isHomemakerLoading ? (
                    <>
                      <Skeleton className="h-7 w-40 mb-2" />
                      <Skeleton className="h-5 w-28" />
                    </>
                  ) : (
                    <>
                      <h1 className="text-2xl font-bold">{homemaker?.username}</h1>
                      <p className="text-muted-foreground">
                        {homemaker?.firstName && homemaker?.lastName 
                          ? `${homemaker.firstName} ${homemaker.lastName}` 
                          : "Homemaker"}
                      </p>
                    </>
                  )}
                  
                  <div className="flex items-center justify-center md:justify-start mt-2">
                    <Badge className="bg-primary text-white flex items-center mr-2">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      Verified
                    </Badge>
                    
                    {!isReviewsLoading && (
                      <div className="flex items-center text-sm">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                        <span>{averageRating.toFixed(1)}</span>
                        <span className="text-muted-foreground ml-1">
                          ({reviews?.length || 0})
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {homemaker?.location && (
                    <div className="flex items-center mt-3 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{homemaker.location}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center mt-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Member since {homemaker?.createdAt ? formatDate(homemaker.createdAt) : "recently"}</span>
                  </div>
                </div>
              </div>
              
              {/* Bio and Stats */}
              <div className="md:w-2/3">
                <div className="mb-4">
                  <h2 className="text-lg font-semibold mb-2">About</h2>
                  {isHomemakerLoading ? (
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  ) : (
                    <p className="text-gray-600">
                      {homemaker?.bio || "This homemaker hasn't added a bio yet."}
                    </p>
                  )}
                </div>
                
                <Separator className="my-4" />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-primary/5 rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {isSkillsLoading ? <Skeleton className="h-8 w-8 mx-auto" /> : skills?.length || 0}
                    </div>
                    <div className="text-sm text-gray-600">Total Skills</div>
                  </div>
                  
                  <div className="text-center p-4 bg-secondary/5 rounded-lg">
                    <div className="text-2xl font-bold text-secondary">
                      {isSkillsLoading ? <Skeleton className="h-8 w-8 mx-auto" /> : verifiedSkillsCount}
                    </div>
                    <div className="text-sm text-gray-600">Verified Skills</div>
                  </div>
                  
                  <div className="text-center p-4 bg-accent/5 rounded-lg">
                    <div className="text-2xl font-bold text-accent">
                      {isListingsLoading ? <Skeleton className="h-8 w-8 mx-auto" /> : listings?.length || 0}
                    </div>
                    <div className="text-sm text-gray-600">Active Listings</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Skills Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Skills & Expertise</CardTitle>
            <CardDescription>
              Skills verified by our AI-powered assessment system
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isSkillsLoading ? (
              <div className="flex space-x-4 overflow-x-auto py-2">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-28 w-28 rounded-lg" />
                ))}
              </div>
            ) : skills?.length > 0 ? (
              <div className="flex space-x-4 overflow-x-auto py-2">
                {skills.map((skill: any) => (
                  <SkillBadge
                    key={skill.id}
                    name={skill.name}
                    category={skill.category}
                    level={skill.level}
                    isVerified={skill.isVerified}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                <p>This homemaker hasn't added any skills yet.</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Tabs for Listings and Reviews */}
        <Tabs defaultValue="listings" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full md:w-auto grid-cols-2">
            <TabsTrigger value="listings">Listings</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          
          <TabsContent value="listings" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isListingsLoading ? (
                Array(3).fill(0).map((_, i) => (
                  <Skeleton key={i} className="h-80 w-full rounded-xl" />
                ))
              ) : listings?.length > 0 ? (
                listings.map((listing: any) => (
                  <ListingCard key={listing.id} listing={listing} homemakerInfo={homemaker} />
                ))
              ) : (
                <div className="col-span-3 text-center py-10 text-muted-foreground">
                  <p>This homemaker doesn't have any active listings yet.</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="reviews" className="mt-6">
            {isReviewsLoading ? (
              <div className="space-y-4">
                {Array(3).fill(0).map((_, i) => (
                  <Skeleton key={i} className="h-32 w-full" />
                ))}
              </div>
            ) : reviews?.length > 0 ? (
              <ReviewsDisplay reviews={reviews} />
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                <p>This homemaker hasn't received any reviews yet.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
