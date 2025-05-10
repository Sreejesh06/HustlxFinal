import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusCircle, TrendingUp, DollarSign, Star, Package, Activity } from "lucide-react";
import AnalyticsCard from "./AnalyticsCard";
import ListingManager from "./ListingManager";
import OrdersTable from "./OrdersTable";
import ReviewsDisplay from "./ReviewsDisplay";
import SkillBadge from "@/components/skills/SkillBadge";
import { useAuth } from "@/lib/auth";

interface HomemakerDashboardProps {
  userId: number;
}

const HomemakerDashboard = ({ userId }: HomemakerDashboardProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const { user } = useAuth();
  
  // Fetch user skills
  const { data: skills, isLoading: skillsLoading } = useQuery({
    queryKey: [`/api/homemakers/${userId}/skills`],
  });
  
  // Fetch user listings
  const { data: listings, isLoading: listingsLoading } = useQuery({
    queryKey: [`/api/homemakers/${userId}/listings`],
  });
  
  // Fetch user orders
  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ['/api/orders/me'],
  });
  
  // Fetch user reviews
  const { data: reviews, isLoading: reviewsLoading } = useQuery({
    queryKey: [`/api/reviews/recipient/${userId}`],
  });
  
  // Calculate analytics values
  const calculateAnalytics = () => {
    const completedOrders = orders?.filter((order: any) => order.status === "completed") || [];
    const totalEarnings = completedOrders.reduce((sum: number, order: any) => sum + order.totalAmount, 0);
    const avgRating = reviews?.length 
      ? reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / reviews.length 
      : 0;
    
    return {
      activeListings: listings?.filter((listing: any) => listing.status === "active").length || 0,
      totalOrders: orders?.length || 0,
      totalEarnings: totalEarnings,
      avgRating: avgRating.toFixed(1),
      viewCount: Math.floor(Math.random() * 1000) + 100, // Mock data for demo
    };
  };
  
  const analytics = calculateAnalytics();
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Homemaker Dashboard</h2>
          <p className="text-muted-foreground">
            Manage your skills, listings, and track your earnings
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <Link href="/skill-verification">
            <Button className="flex items-center bg-secondary">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Skill
            </Button>
          </Link>
          <Link href="/create-listing">
            <Button className="flex items-center">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Listing
            </Button>
          </Link>
        </div>
      </div>
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 md:w-auto w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="listings">Listings</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          {/* Analytics Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <AnalyticsCard 
              title="Total Earnings"
              value={`$${(analytics.totalEarnings / 100).toFixed(2)}`}
              description="Lifetime earnings"
              icon={<DollarSign className="h-5 w-5 text-green-500" />}
              trend={+12.5}
            />
            <AnalyticsCard 
              title="Active Listings"
              value={analytics.activeListings.toString()}
              description="Across all categories"
              icon={<Package className="h-5 w-5 text-primary" />}
            />
            <AnalyticsCard 
              title="Completed Orders"
              value={analytics.totalOrders.toString()}
              description="Lifetime orders"
              icon={<TrendingUp className="h-5 w-5 text-blue-500" />}
              trend={+8.2}
            />
            <AnalyticsCard 
              title="Average Rating"
              value={analytics.avgRating}
              description={`From ${reviews?.length || 0} reviews`}
              icon={<Star className="h-5 w-5 text-yellow-500" />}
            />
          </div>
          
          {/* Skills Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Your Skills</span>
                <Link href="/skill-verification">
                  <Button variant="outline" size="sm">
                    Add Skill
                  </Button>
                </Link>
              </CardTitle>
              <CardDescription>
                Your verified skills are displayed to customers
              </CardDescription>
            </CardHeader>
            <CardContent>
              {skillsLoading ? (
                <div className="flex space-x-4 overflow-x-auto py-2">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-24 w-24 rounded-lg" />
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
                  <p>You haven't added any skills yet.</p>
                  <Link href="/skill-verification">
                    <Button className="mt-2" variant="outline">
                      Add Your First Skill
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>
                Your most recent customer orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              {ordersLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : orders?.length > 0 ? (
                <OrdersTable orders={orders.slice(0, 5)} compact />
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  <p>No orders received yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Recent Reviews */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Reviews</CardTitle>
              <CardDescription>
                What customers are saying about you
              </CardDescription>
            </CardHeader>
            <CardContent>
              {reviewsLoading ? (
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <Skeleton key={i} className="h-24 w-full" />
                  ))}
                </div>
              ) : reviews?.length > 0 ? (
                <ReviewsDisplay reviews={reviews.slice(0, 3)} compact />
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  <p>No reviews yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="listings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Your Listings</span>
                <Link href="/create-listing">
                  <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Listing
                  </Button>
                </Link>
              </CardTitle>
              <CardDescription>
                Manage all your service and product listings
              </CardDescription>
            </CardHeader>
            <CardContent>
              {listingsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-28 w-full" />
                  ))}
                </div>
              ) : (
                <ListingManager listings={listings || []} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="orders" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Orders</CardTitle>
              <CardDescription>
                View and manage all your customer orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              {ordersLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : orders?.length > 0 ? (
                <OrdersTable orders={orders} />
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  <p>No orders received yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reviews" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Reviews</CardTitle>
              <CardDescription>
                All reviews from customers who have purchased your services or products
              </CardDescription>
            </CardHeader>
            <CardContent>
              {reviewsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-24 w-full" />
                  ))}
                </div>
              ) : reviews?.length > 0 ? (
                <ReviewsDisplay reviews={reviews} />
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No reviews yet.</p>
                  <p className="text-sm mt-1">
                    As you complete orders, customers can leave reviews for your services.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HomemakerDashboard;
