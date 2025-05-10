import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingBag, Package, Star, Clock, Search } from "lucide-react";
import OrdersTable from "./OrdersTable";
import ReviewsDisplay from "./ReviewsDisplay";
import ListingCard from "@/components/marketplace/ListingCard";
import { useAuth } from "@/lib/auth";

interface CustomerDashboardProps {
  userId: number;
}

const CustomerDashboard = ({ userId }: CustomerDashboardProps) => {
  const [activeTab, setActiveTab] = useState("orders");
  
  // Fetch user orders
  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ['/api/orders/me'],
  });
  
  // Fetch user reviews
  const { data: reviews, isLoading: reviewsLoading } = useQuery({
    queryKey: [`/api/reviews/author/${userId}`],
  });
  
  // Fetch featured listings for recommendations
  const { data: featuredListings, isLoading: listingsLoading } = useQuery({
    queryKey: ['/api/listings/featured'],
  });
  
  const ordersByStatus = {
    pending: orders?.filter((order: any) => order.status === "pending") || [],
    paid: orders?.filter((order: any) => order.status === "paid") || [],
    completed: orders?.filter((order: any) => order.status === "completed") || [],
    canceled: orders?.filter((order: any) => order.status === "canceled") || [],
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Customer Dashboard</h2>
          <p className="text-muted-foreground">
            Manage your orders, reviews, and discover new services
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link href="/marketplace">
            <Button className="flex items-center">
              <Search className="mr-2 h-4 w-4" />
              Browse Services
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Order Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <ShoppingBag className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                <h4 className="text-2xl font-bold">{orders?.length || 0}</h4>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-yellow-500/10 p-3 rounded-full">
                <Clock className="h-6 w-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <h4 className="text-2xl font-bold">{ordersByStatus.pending.length}</h4>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-green-500/10 p-3 rounded-full">
                <Package className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <h4 className="text-2xl font-bold">{ordersByStatus.completed.length}</h4>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-500/10 p-3 rounded-full">
                <Star className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Reviews</p>
                <h4 className="text-2xl font-bold">{reviews?.length || 0}</h4>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="orders" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full md:w-auto">
          <TabsTrigger value="orders">My Orders</TabsTrigger>
          <TabsTrigger value="reviews">My Reviews</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="orders" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Orders</CardTitle>
              <CardDescription>
                Your orders from homemakers
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
                <OrdersTable orders={orders} isCustomer />
              ) : (
                <div className="text-center py-10">
                  <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                  <h3 className="text-lg font-medium">No orders yet</h3>
                  <p className="text-muted-foreground mt-1">
                    Browse services and products to make your first order
                  </p>
                  <Link href="/marketplace">
                    <Button className="mt-4">
                      Browse Marketplace
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reviews" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>My Reviews</CardTitle>
              <CardDescription>
                Reviews you've left for homemakers
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
                <ReviewsDisplay reviews={reviews} isOwn />
              ) : (
                <div className="text-center py-10">
                  <Star className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                  <h3 className="text-lg font-medium">No reviews yet</h3>
                  <p className="text-muted-foreground mt-1">
                    After completing an order, you can leave a review
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="recommendations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recommended for You</CardTitle>
              <CardDescription>
                Services and products we think you'll like
              </CardDescription>
            </CardHeader>
            <CardContent>
              {listingsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-64 w-full rounded-xl" />
                  ))}
                </div>
              ) : featuredListings?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {featuredListings.slice(0, 6).map((listing: any) => (
                    <ListingCard key={listing.id} listing={listing} compact />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <Search className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                  <h3 className="text-lg font-medium">No recommendations yet</h3>
                  <p className="text-muted-foreground mt-1">
                    Browse the marketplace to discover services
                  </p>
                  <Link href="/marketplace">
                    <Button className="mt-4">
                      Browse Marketplace
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomerDashboard;
