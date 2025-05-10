import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams, useLocation } from "wouter";
import { Helmet } from "react-helmet";
import { 
  MapPin, 
  Calendar, 
  Star, 
  ShoppingBag,
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
import ReviewsDisplay from "@/components/dashboard/ReviewsDisplay";
import { useAuth } from "@/lib/auth";

export default function CustomerProfile() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("reviews");
  
  // Parse the ID to number
  const customerId = parseInt(id!);
  
  // Redirect to dashboard if viewing own profile
  useEffect(() => {
    if (isAuthenticated && user?.id === customerId && user?.role === "customer") {
      setLocation("/dashboard");
    }
  }, [isAuthenticated, user, customerId, setLocation]);
  
  // Fetch customer data
  const { data: customer, isLoading: isCustomerLoading } = useQuery({
    queryKey: [`/api/users/${customerId}`],
    enabled: !!customerId && (!isAuthenticated || user?.id !== customerId),
  });
  
  // Fetch customer reviews (as author)
  const { data: reviews, isLoading: isReviewsLoading } = useQuery({
    queryKey: [`/api/reviews/author/${customerId}`],
    enabled: !!customerId,
  });
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
    }).format(date);
  };
  
  // Calculate average rating given
  const averageRatingGiven = reviews?.length
    ? reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / reviews.length
    : 0;
  
  return (
    <>
      <Helmet>
        <title>
          {isCustomerLoading
            ? "Loading Profile... | EmpowerHer"
            : `${customer?.username || `Customer #${customerId}`} | EmpowerHer`}
        </title>
        <meta
          name="description"
          content={`View ${customer?.username || "this customer's"} profile and reviews on EmpowerHer.`}
        />
      </Helmet>
      
      <div className="container px-4 py-8 mx-auto max-w-7xl">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-6 sm:p-8">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar and Basic Info */}
              <div className="md:w-1/3 flex flex-col items-center md:items-start">
                {isCustomerLoading ? (
                  <Skeleton className="w-32 h-32 rounded-full" />
                ) : (
                  <Avatar className="w-32 h-32 border-4 border-primary/10">
                    <AvatarImage src={customer?.profilePicture} alt={customer?.username} />
                    <AvatarFallback className="text-3xl">
                      {customer?.username?.[0]?.toUpperCase() || "C"}
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div className="mt-4 text-center md:text-left">
                  {isCustomerLoading ? (
                    <>
                      <Skeleton className="h-7 w-40 mb-2" />
                      <Skeleton className="h-5 w-28" />
                    </>
                  ) : (
                    <>
                      <h1 className="text-2xl font-bold">{customer?.username}</h1>
                      <p className="text-muted-foreground">
                        {customer?.firstName && customer?.lastName 
                          ? `${customer.firstName} ${customer.lastName}` 
                          : "Customer"}
                      </p>
                    </>
                  )}
                  
                  <div className="flex items-center justify-center md:justify-start mt-2">
                    <Badge className="bg-accent text-white flex items-center mr-2">
                      Customer
                    </Badge>
                    
                    {!isReviewsLoading && reviews?.length > 0 && (
                      <div className="flex items-center text-sm">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                        <span>{averageRatingGiven.toFixed(1)}</span>
                        <span className="text-muted-foreground ml-1">
                          ({reviews?.length || 0} reviews)
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {customer?.location && (
                    <div className="flex items-center mt-3 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{customer.location}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center mt-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Member since {customer?.createdAt ? formatDate(customer.createdAt) : "recently"}</span>
                  </div>
                </div>
              </div>
              
              {/* Bio and Stats */}
              <div className="md:w-2/3">
                <div className="mb-4">
                  <h2 className="text-lg font-semibold mb-2">About</h2>
                  {isCustomerLoading ? (
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  ) : (
                    <p className="text-gray-600">
                      {customer?.bio || "This customer hasn't added a bio yet."}
                    </p>
                  )}
                </div>
                
                <Separator className="my-4" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-primary/5 rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {isReviewsLoading ? <Skeleton className="h-8 w-8 mx-auto" /> : reviews?.length || 0}
                    </div>
                    <div className="text-sm text-gray-600">Reviews Given</div>
                  </div>
                  
                  <div className="text-center p-4 bg-accent/5 rounded-lg">
                    <div className="text-2xl font-bold text-accent">
                      <ShoppingBag className="h-6 w-6 mx-auto text-accent" />
                    </div>
                    <div className="text-sm text-gray-600">Active Customer</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Tabs for Reviews */}
        <Tabs defaultValue="reviews" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full md:w-auto grid-cols-1">
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          
          <TabsContent value="reviews" className="mt-6">
            {isReviewsLoading ? (
              <div className="space-y-4">
                {Array(3).fill(0).map((_, i) => (
                  <Skeleton key={i} className="h-32 w-full" />
                ))}
              </div>
            ) : reviews?.length > 0 ? (
              <ReviewsDisplay reviews={reviews} isOwn />
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                <p>This customer hasn't written any reviews yet.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
