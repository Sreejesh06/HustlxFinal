import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Listing } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import ListingForm from "@/components/forms/ListingForm";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export default function Marketplace() {
  const { user, isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  
  const { data: listings, isLoading } = useQuery({
    queryKey: ['/api/listings'],
  });
  
  const categories = [
    { value: "all", label: "All Categories" },
    { value: "baking", label: "Baking & Culinary" },
    { value: "crafts", label: "Arts & Crafts" },
    { value: "services", label: "Home Services" },
    { value: "teaching", label: "Teaching & Workshops" },
    { value: "digital", label: "Digital Services" },
    { value: "events", label: "Events & Planning" }
  ];
  
  const filteredListings = listings?.filter((listing: Listing) => {
    const matchesSearch = 
      listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === "all" || listing.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  }) || [];
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-neutral-800 mb-2">
            Marketplace
          </h1>
          <p className="text-neutral-600">
            Discover services and products from talented homemakers
          </p>
        </div>
        
        {isAuthenticated && (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="mt-4 md:mt-0 bg-primary hover:bg-primary-dark text-white">
                <i className="ri-add-line mr-1.5"></i> Add New Listing
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <ListingForm userId={user?.id} />
            </DialogContent>
          </Dialog>
        )}
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-sm mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Input
              type="text"
              placeholder="Search listings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"></i>
          </div>
          
          <div className="w-full md:w-64">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-96 w-full" />
          ))}
        </div>
      ) : filteredListings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((listing: Listing) => (
            <Card key={listing.id} className="overflow-hidden h-full flex flex-col">
              {listing.image ? (
                <div className="h-48 overflow-hidden">
                  <img
                    src={listing.image}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="h-48 bg-neutral-100 flex items-center justify-center">
                  <i className="ri-image-line text-4xl text-neutral-400"></i>
                </div>
              )}
              
              <CardContent className="pt-6 flex-grow">
                <Badge className="mb-2 bg-primary/10 text-primary hover:bg-primary/20 border-0">
                  {categories.find(c => c.value === listing.category)?.label || listing.category}
                </Badge>
                <h3 className="font-semibold text-lg mb-2">{listing.title}</h3>
                <p className="text-neutral-600 text-sm mb-4 line-clamp-3">
                  {listing.description}
                </p>
                
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
              </CardContent>
              
              <CardFooter className="pt-0 pb-6">
                <Button
                  className="w-full bg-secondary hover:bg-secondary-dark text-white"
                >
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg shadow-sm">
          <div className="mx-auto w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
            <i className="ri-search-line text-3xl text-neutral-400"></i>
          </div>
          <h3 className="text-xl font-semibold mb-2">No Listings Found</h3>
          <p className="text-neutral-600 max-w-md mx-auto mb-6">
            We couldn't find any listings matching your search criteria. Try adjusting your filters or search terms.
          </p>
          {searchTerm || categoryFilter !== "all" ? (
            <Button 
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setCategoryFilter("all");
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
