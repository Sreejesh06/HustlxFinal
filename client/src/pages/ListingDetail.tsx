import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import {
  ChevronLeft,
  Heart,
  Share,
  MapPin,
  Calendar,
  Star,
  CheckCircle2,
  ShoppingCart,
  User,
  ArrowRight,
  Tag,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { apiRequest } from "@/lib/queryClient";
import ReviewsDisplay from "@/components/dashboard/ReviewsDisplay";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export default function ListingDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user, isAuthenticated, setShowLoginModal } = useAuth();
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  
  // Form schema for booking/ordering
  const orderFormSchema = z.object({
    quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
    notes: z.string().optional(),
    deliveryDate: z.string().optional(),
  });
  
  type OrderFormValues = z.infer<typeof orderFormSchema>;
  
  // Order form initialization
  const orderForm = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      quantity: 1,
      notes: "",
      deliveryDate: "",
    },
  });
  
  // Fetch listing details
  const { data: listing, isLoading: listingLoading } = useQuery({
    queryKey: [`/api/listings/${id}`],
    enabled: !!id,
  });
  
  // Fetch listing reviews
  const { data: reviews, isLoading: reviewsLoading } = useQuery({
    queryKey: [`/api/reviews/listing/${id}`],
    enabled: !!id,
  });
  
  // Fetch homemaker details
  const { data: homemaker, isLoading: homemakerLoading } = useQuery({
    queryKey: listing ? [`/api/users/${listing.homemakerId}`] : null,
    enabled: !!listing?.homemakerId,
  });
  
  // Create order mutation
  const createOrderMutation = useMutation({
    mutationFn: (data: OrderFormValues) => {
      return apiRequest("POST", "/api/orders", {
        listingId: parseInt(id!),
        ...data,
      });
    },
    onSuccess: (data) => {
      toast({
        title: "Order placed successfully",
        description: `Your order for ${listing?.title} has been placed.`,
      });
      setBookingDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['/api/orders/me'] });
      
      // Redirect to orders page
      setLocation("/dashboard");
    },
    onError: (error: Error) => {
      toast({
        title: "Error placing order",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Handle booking/order submission
  const handleOrderSubmit = (data: OrderFormValues) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to place an order.",
      });
      setShowLoginModal(true);
      return;
    }
    
    createOrderMutation.mutate(data);
  };
  
  // Format currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price / 100); // Price is stored in cents
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };
  
  // Calculate total price based on quantity
  const calculateTotal = (price: number, quantity: number) => {
    return price * quantity;
  };
  
  // Handle quantity change to update total
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const quantity = parseInt(e.target.value);
    if (quantity > 0) {
      orderForm.setValue("quantity", quantity);
    }
  };

  // Calculate average rating
  const averageRating = reviews?.length
    ? reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / reviews.length
    : 0;
  
  return (
    <>
      <Helmet>
        <title>
          {listingLoading
            ? "Loading... | EmpowerHer"
            : `${listing?.title || "Listing"} | EmpowerHer`}
        </title>
        <meta
          name="description"
          content={listing?.description || "View this listing on EmpowerHer"}
        />
      </Helmet>
      
      <div className="container px-4 py-8 mx-auto max-w-7xl">
        {/* Breadcrumb navigation */}
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground"
            onClick={() => setLocation("/marketplace")}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Marketplace
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content - left column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Listing images */}
            <div className="rounded-xl overflow-hidden bg-gray-100 aspect-video relative">
              {listingLoading ? (
                <Skeleton className="w-full h-full" />
              ) : listing?.images && listing.images.length > 0 ? (
                <img
                  src={listing.images[0]}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <p>No image available</p>
                </div>
              )}
            </div>
            
            {/* Listing details */}
            <div>
              {listingLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-10 w-3/4" />
                  <div className="flex space-x-2">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ) : (
                <>
                  <h1 className="text-3xl font-bold mb-3">{listing?.title}</h1>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge className="bg-primary text-white">
                      {listing?.type === "service" ? "Service" : "Product"}
                    </Badge>
                    <Badge variant="outline" className="bg-primary-light bg-opacity-10 text-primary border-none">
                      {listing?.category}
                    </Badge>
                    {listing?.subcategory && (
                      <Badge variant="outline" className="bg-primary-light bg-opacity-10 text-primary border-none">
                        {listing.subcategory}
                      </Badge>
                    )}
                    {listing?.tags && listing.tags.map((tag: string) => (
                      <Badge key={tag} variant="outline" className="bg-primary-light bg-opacity-10 text-primary border-none">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center mb-4">
                    <div className="flex items-center">
                      <Star className="h-5 w-5 text-yellow-400 fill-yellow-400 mr-1" />
                      <span className="font-medium">
                        {averageRating ? averageRating.toFixed(1) : "New"}
                      </span>
                      <span className="text-muted-foreground ml-1">
                        ({reviews?.length || 0} reviews)
                      </span>
                    </div>
                    
                    {listing?.location && (
                      <div className="flex items-center ml-6 text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{listing.location}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">Description</h2>
                    <p className="text-gray-700 whitespace-pre-line">{listing?.description}</p>
                  </div>
                </>
              )}
            </div>
            
            {/* Tabs for reviews and details */}
            <Tabs defaultValue="reviews">
              <TabsList>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
              </TabsList>
              
              <TabsContent value="reviews" className="space-y-4 pt-4">
                {reviewsLoading ? (
                  <div className="space-y-4">
                    {Array(3).fill(0).map((_, i) => (
                      <Skeleton key={i} className="h-32 w-full" />
                    ))}
                  </div>
                ) : reviews?.length > 0 ? (
                  <ReviewsDisplay reviews={reviews} />
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p className="mb-2">No reviews yet</p>
                    <p className="text-sm">Be the first to review this listing after your purchase.</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="details" className="pt-4">
                <div className="space-y-4">
                  {listing?.isFeatured && (
                    <div className="flex items-start">
                      <Badge className="bg-accent text-white mt-0.5 mr-3">FEATURED</Badge>
                      <div>
                        <h3 className="font-medium">Featured Listing</h3>
                        <p className="text-sm text-muted-foreground">
                          This is a featured listing highlighted for its quality and reliability.
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-start">
                    <Tag className="h-5 w-5 mt-0.5 mr-3 text-primary" />
                    <div>
                      <h3 className="font-medium">Category</h3>
                      <p className="text-sm text-muted-foreground">
                        {listing?.category}
                        {listing?.subcategory && ` › ${listing.subcategory}`}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 mt-0.5 mr-3 text-primary" />
                    <div>
                      <h3 className="font-medium">Listed Since</h3>
                      <p className="text-sm text-muted-foreground">
                        {listing?.createdAt ? formatDate(listing.createdAt) : "Recently"}
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Sidebar - right column */}
          <div className="lg:col-span-1 space-y-6">
            {/* Pricing card */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {listingLoading ? (
                    <Skeleton className="h-8 w-32" />
                  ) : (
                    formatPrice(listing?.price || 0)
                  )}
                  <span className="text-sm font-normal text-muted-foreground ml-1">
                    {listing?.type === "service" ? "/session" : ""}
                  </span>
                </CardTitle>
                <CardDescription>
                  {listing?.type === "service" ? "Book this service" : "Purchase this product"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => {
                    if (!isAuthenticated) {
                      toast({
                        title: "Authentication required",
                        description: "Please log in to place an order.",
                      });
                      setShowLoginModal(true);
                      return;
                    }
                    setBookingDialogOpen(true);
                  }}
                  disabled={listingLoading}
                >
                  {listing?.type === "service" ? (
                    <>Book Now</>
                  ) : (
                    <>
                      <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                    </>
                  )}
                </Button>
                
                <div className="mt-6 space-y-2">
                  <div className="flex items-center text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                    <span>Verified by AI</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                    <span>Secure payment</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                    <span>Satisfaction guarantee</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Homemaker card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">About the Homemaker</CardTitle>
              </CardHeader>
              <CardContent>
                {homemakerLoading ? (
                  <div className="flex items-center space-x-4 mb-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-4 mb-4">
                    <Avatar>
                      <AvatarImage src={homemaker?.profilePicture} />
                      <AvatarFallback>
                        {homemaker?.username?.[0]?.toUpperCase() || "H"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{homemaker?.username}</h3>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>Member since {homemaker?.createdAt ? formatDate(homemaker.createdAt).split(',')[0] : "recently"}</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <Separator className="my-4" />
                
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setLocation(`/homemaker/${listing?.homemakerId}`)}
                >
                  <User className="mr-2 h-4 w-4" /> View Profile
                </Button>
              </CardContent>
            </Card>
            
            {/* Share card */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between">
                  <Button variant="outline" className="flex-1 mr-2">
                    <Heart className="mr-2 h-4 w-4" /> Save
                  </Button>
                  <Button variant="outline" className="flex-1 ml-2">
                    <Share className="mr-2 h-4 w-4" /> Share
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Booking/Order Dialog */}
        <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {listing?.type === "service" ? "Book Service" : "Purchase Product"}
              </DialogTitle>
              <DialogDescription>
                {listing?.type === "service"
                  ? "Complete your booking for this service"
                  : "Complete your purchase for this product"}
              </DialogDescription>
            </DialogHeader>
            
            <Form {...orderForm}>
              <form onSubmit={orderForm.handleSubmit(handleOrderSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <h3 className="font-medium">{listing?.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {formatPrice(listing?.price || 0)}
                    {listing?.type === "service" ? "/session" : ""}
                  </p>
                </div>
                
                <Separator />
                
                <FormField
                  control={orderForm.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          {...field}
                          onChange={handleQuantityChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {listing?.type === "service" && (
                  <FormField
                    control={orderForm.control}
                    name="deliveryDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormDescription>
                          Select your preferred date for this service
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                <FormField
                  control={orderForm.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Special Instructions</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Add any special requirements or notes..."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex justify-between font-medium">
                    <span>Total:</span>
                    <span>
                      {formatPrice(calculateTotal(
                        listing?.price || 0,
                        orderForm.watch("quantity") || 1
                      ))}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    By proceeding, you agree to our Terms of Service and Privacy Policy.
                  </p>
                </div>
                
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setBookingDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createOrderMutation.isPending}
                    className="ml-2"
                  >
                    {createOrderMutation.isPending ? (
                      "Processing..."
                    ) : (
                      <>
                        Confirm {listing?.type === "service" ? "Booking" : "Purchase"}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
