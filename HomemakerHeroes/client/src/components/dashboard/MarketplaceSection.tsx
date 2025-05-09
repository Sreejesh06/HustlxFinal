import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Listing } from "@/lib/types";
import ListingForm from "@/components/forms/ListingForm";
import { useToast } from "@/hooks/use-toast";

interface MarketplaceSectionProps {
  listings: Listing[];
  isLoading: boolean;
}

export default function MarketplaceSection({
  listings,
  isLoading
}: MarketplaceSectionProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const businessSuggestionMutation = useMutation({
    mutationFn: async (data: { skills: string[]; currentServices: string[]; averagePrice: number }) => {
      const res = await apiRequest("POST", "/api/ai/business-suggestions", data);
      return res.json();
    },
  });
  
  // Generate business suggestion when component mounts if we have listings
  const handleGenerateSuggestion = () => {
    if (!user || listings.length === 0) return;
    
    // Extract data from listings for AI suggestion
    const skills = listings.map(listing => listing.title.split(' ')[0]); // Simple extraction for demo
    const currentServices = listings.map(listing => listing.title);
    
    // Calculate average price - assuming price is stored as string like "$45-120"
    const averagePrice = listings.reduce((sum, listing) => {
      const priceStr = listing.price.replace('$', '');
      const prices = priceStr.split('-').map(p => parseInt(p.trim()));
      return sum + (prices.reduce((a, b) => a + b, 0) / prices.length);
    }, 0) / listings.length;
    
    businessSuggestionMutation.mutate({
      skills,
      currentServices,
      averagePrice: Math.round(averagePrice)
    });
  };
  
  if (isLoading) {
    return (
      <div className="mb-6">
        <Skeleton className="h-96 w-full mb-6" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm p-5 border border-neutral-200 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-headings font-semibold text-neutral-800">Your Marketplace Listings</h2>
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon" className="text-neutral-600 hover:text-primary">
              <i className="ri-filter-3-line"></i>
            </Button>
            <Button variant="ghost" size="icon" className="text-neutral-600 hover:text-primary">
              <i className="ri-sort-desc"></i>
            </Button>
          </div>
        </div>
        
        {listings.length > 0 ? (
          <div className="space-y-4 mb-4">
            {listings.map((listing) => (
              <div key={listing.id} className="border border-neutral-200 rounded-lg p-4 flex flex-col md:flex-row">
                <div className="md:w-36 h-36 md:h-auto rounded-md overflow-hidden mb-3 md:mb-0 flex-shrink-0">
                  {listing.image ? (
                    <img
                      src={listing.image}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-neutral-100 flex items-center justify-center">
                      <i className="ri-image-line text-4xl text-neutral-400"></i>
                    </div>
                  )}
                </div>
                <div className="md:ml-4 flex-grow">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                    <h3 className="font-headings font-semibold text-neutral-800">{listing.title}</h3>
                    <div className="flex items-center mt-1 md:mt-0">
                      <span className={`bg-${listing.status === 'active' ? 'green' : 'neutral'}-100 text-${listing.status === 'active' ? 'green' : 'neutral'}-800 text-xs font-medium px-2 py-0.5 rounded`}>
                        {listing.status === 'active' ? 'Active' : listing.status === 'draft' ? 'Draft' : listing.status}
                      </span>
                      <span className="text-sm text-neutral-500 ml-2">
                        Listed {formatDate(listing.createdAt)}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-neutral-700 mb-3">{listing.description}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-2 py-1 bg-neutral-100 text-neutral-700 rounded text-xs">
                      {listing.price}
                    </span>
                    {listing.tags?.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-neutral-100 text-neutral-700 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="text-accent mr-1"><i className="ri-star-fill"></i></div>
                      <span className="text-sm font-medium">4.9</span>
                      <span className="text-sm text-neutral-500 ml-1">(12 reviews)</span>
                    </div>
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-neutral-600 hover:text-primary">
                            <i className="ri-edit-line"></i>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                          <ListingForm userId={user?.id} initialData={listing} />
                        </DialogContent>
                      </Dialog>
                      <Button variant="ghost" size="icon" className="text-neutral-600 hover:text-primary">
                        <i className="ri-bar-chart-2-line"></i>
                      </Button>
                      <Button variant="ghost" size="icon" className="text-neutral-600 hover:text-primary">
                        <i className="ri-more-2-fill"></i>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Draft Listing with AI Feature */}
            <div className="border border-dashed border-neutral-300 rounded-lg p-4">
              <div className="flex items-start">
                <div className="bg-neutral-100 rounded-md p-3">
                  <i className="ri-draft-line text-neutral-500 text-2xl"></i>
                </div>
                <div className="ml-4 flex-grow">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-headings font-semibold text-neutral-700">Quilting Workshop (Draft)</h3>
                    <span className="bg-neutral-100 text-neutral-500 text-xs font-medium px-2 py-0.5 rounded">Draft</span>
                  </div>
                  <p className="text-sm text-neutral-600 mb-3">
                    You've started creating this listing. Complete it to start receiving bookings.
                  </p>
                  <div className="bg-blue-50 border-l-4 border-blue-300 p-3 rounded-r-md mb-3">
                    <div className="flex items-start">
                      <i className="ri-robot-line text-blue-500 mt-0.5"></i>
                      <div className="ml-2">
                        <p className="text-sm text-blue-800 font-medium">AI Pricing Suggestion</p>
                        <p className="text-sm text-blue-700">
                          Based on similar workshops in your area, we recommend pricing at $45-55 per person for a 2-hour session.
                        </p>
                      </div>
                    </div>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="link" className="text-sm font-medium text-primary hover:text-primary-dark p-0 h-auto">
                        Continue editing <i className="ri-arrow-right-line ml-1"></i>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <ListingForm 
                        userId={user?.id} 
                        initialData={{
                          id: 0,
                          userId: user?.id || 0,
                          title: "Quilting Workshop",
                          description: "",
                          price: "$45-55",
                          image: "",
                          category: "teaching",
                          tags: ["Workshops", "Crafts"],
                          status: "draft",
                          createdAt: new Date()
                        }} 
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto bg-neutral-100 rounded-full flex items-center justify-center mb-4">
              <i className="ri-store-2-line text-2xl text-neutral-400"></i>
            </div>
            <h3 className="text-lg font-semibold mb-2">No Listings Yet</h3>
            <p className="text-neutral-600 max-w-md mx-auto mb-6">
              Create your first listing to start showcasing your skills and services to potential customers.
            </p>
          </div>
        )}
        
        <Dialog>
          <DialogTrigger asChild>
            <Button 
              variant="outline"
              className="w-full text-primary hover:text-primary-dark font-medium text-sm flex items-center justify-center py-2 border border-dashed border-neutral-300"
            >
              <i className="ri-add-line mr-1.5"></i> Add new listing
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <ListingForm userId={user?.id} />
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Earnings Overview */}
      <div className="bg-white rounded-xl shadow-sm p-5 border border-neutral-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-headings font-semibold text-neutral-800">Earnings Overview</h2>
          <div className="flex space-x-2">
            <select className="text-sm border-0 text-neutral-600 focus:ring-0 py-0 pr-6 pl-2">
              <option>Last 30 days</option>
              <option>Last 90 days</option>
              <option>This year</option>
              <option>All time</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-neutral-50 rounded-lg p-4">
            <p className="text-neutral-600 text-sm mb-1">Total Earnings</p>
            <h3 className="text-2xl font-headings font-bold text-neutral-800">₹62,500.00</h3>
            <div className="flex items-center mt-1 text-sm">
              <span className="text-green-600 flex items-center">
                <i className="ri-arrow-up-line mr-0.5"></i> 24%
              </span>
              <span className="text-neutral-500 ml-1">vs. previous period</span>
            </div>
          </div>
          
          <div className="bg-neutral-50 rounded-lg p-4">
            <p className="text-neutral-600 text-sm mb-1">Orders Completed</p>
            <h3 className="text-2xl font-headings font-bold text-neutral-800">18</h3>
            <div className="flex items-center mt-1 text-sm">
              <span className="text-green-600 flex items-center">
                <i className="ri-arrow-up-line mr-0.5"></i> 12%
              </span>
              <span className="text-neutral-500 ml-1">vs. previous period</span>
            </div>
          </div>
          
          <div className="bg-neutral-50 rounded-lg p-4">
            <p className="text-neutral-600 text-sm mb-1">Average Order Value</p>
            <h3 className="text-2xl font-headings font-bold text-neutral-800">₹3,472.22</h3>
            <div className="flex items-center mt-1 text-sm">
              <span className="text-green-600 flex items-center">
                <i className="ri-arrow-up-line mr-0.5"></i> 8%
              </span>
              <span className="text-neutral-500 ml-1">vs. previous period</span>
            </div>
          </div>
        </div>
        
        {/* Growth opportunity card */}
        {businessSuggestionMutation.isSuccess && (
          <div className="border border-neutral-200 rounded-lg p-4 bg-gradient-to-r from-neutral-50 to-white">
            <div className="flex items-start">
              <div className="bg-secondary bg-opacity-10 rounded-md p-2.5">
                <i className="ri-line-chart-line text-secondary text-xl"></i>
              </div>
              <div className="ml-4 flex-grow">
                <div className="flex items-center justify-between">
                  <h3 className="font-headings font-semibold text-neutral-800">Growth Opportunity</h3>
                  <span className="bg-secondary bg-opacity-10 text-secondary text-xs font-medium px-2 py-0.5 rounded">AI Insight</span>
                </div>
                <p className="text-sm text-neutral-700 my-2">
                  {businessSuggestionMutation.data?.suggestion || "Based on your sales patterns, offering a \"Mini Cake Sampler Box\" could increase your average order value by 15-20%."}
                </p>
                <div className="flex flex-wrap gap-3 mt-3">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="link" 
                        className="text-sm font-medium text-secondary hover:text-secondary-dark p-0 h-auto"
                      >
                        Create new listing <i className="ri-arrow-right-line ml-1"></i>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <ListingForm 
                        userId={user?.id} 
                        initialData={{
                          id: 0,
                          userId: user?.id || 0,
                          title: "Mini Sampler Box",
                          description: "A collection of mini versions of your favorites",
                          price: "₹2,500-3,500",
                          image: "",
                          category: "baking",
                          tags: ["Sampler", "Gift Box"],
                          status: "draft",
                          createdAt: new Date()
                        }} 
                      />
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="link"
                    className="text-sm text-neutral-500 hover:text-neutral-700 p-0 h-auto"
                    onClick={() => businessSuggestionMutation.reset()}
                  >
                    Dismiss
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {!businessSuggestionMutation.isSuccess && listings.length > 0 && (
          <Button
            variant="outline"
            className="w-full text-secondary hover:text-secondary-dark"
            onClick={handleGenerateSuggestion}
            disabled={businessSuggestionMutation.isPending}
          >
            {businessSuggestionMutation.isPending ? (
              <>Generating business suggestions...</>
            ) : (
              <>Get AI business growth suggestions <i className="ri-magic-line ml-1.5"></i></>
            )}
          </Button>
        )}
      </div>
    </>
  );
}

// Helper function to format dates relative to now
function formatDate(date: Date | string) {
  const now = new Date();
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const diffTime = Math.abs(now.getTime() - dateObj.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'today';
  if (diffDays === 1) return 'yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 14) return '1 week ago';
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 60) return '1 month ago';
  
  return `${Math.floor(diffDays / 30)} months ago`;
}
