import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ListingCard from '@/components/marketplace/ListingCard';
import CategoryFilter from '@/components/marketplace/CategoryFilter';
import { Skeleton } from '@/components/ui/skeleton';

interface Listing {
  id: number;
  homemakerId: number;
  title: string;
  description: string;
  price: number;
  type: 'service' | 'product';
  category: string;
  subcategory?: string;
  tags?: string[];
  images?: string[];
  isFeatured: boolean;
  location?: string;
  status: 'active' | 'inactive' | 'pending';
}

const categories = [
  "All Categories",
  "Cooking & Baking",
  "Crafts & Handmade",
  "Tutoring",
  "Home Services",
  "Beauty & Wellness"
];

const FeaturedListings = () => {
  const [activeCategory, setActiveCategory] = useState("All Categories");
  
  const { data: listings, isLoading, error } = useQuery({
    queryKey: ['/api/listings/featured'],
    staleTime: 60000, // 1 minute
  });

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };

  // Filter listings based on selected category
  const filteredListings = listings ? (
    activeCategory === "All Categories"
      ? listings
      : listings.filter((listing: Listing) => 
          listing.category === activeCategory || 
          listing.subcategory === activeCategory
        )
  ) : [];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold font-heading">Featured Services & Products</h2>
          <div className="hidden md:flex space-x-2">
            <button className="p-2 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-primary hover:text-white transition">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button className="p-2 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-primary hover:text-white transition">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        {/* Category filters */}
        <CategoryFilter 
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
        />
        
        {/* Listings grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            // Skeleton loading state
            Array(3).fill(0).map((_, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-md">
                <Skeleton className="w-full h-48" />
                <div className="p-5">
                  <div className="flex items-center mb-3">
                    <Skeleton className="w-8 h-8 rounded-full mr-2" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-5 w-20 rounded-full" />
                    <Skeleton className="h-5 w-14 rounded-full" />
                  </div>
                  <Skeleton className="h-4 w-full mb-4" />
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-10 w-24 rounded-md" />
                  </div>
                </div>
              </div>
            ))
          ) : error ? (
            <div className="col-span-3 py-10 text-center">
              <p className="text-red-500">Failed to load listings. Please try again later.</p>
            </div>
          ) : filteredListings.length > 0 ? (
            filteredListings.map((listing: Listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))
          ) : (
            <div className="col-span-3 py-10 text-center">
              <p className="text-gray-500">No listings found in this category.</p>
            </div>
          )}
        </div>
        
        <div className="mt-10 text-center">
          <Link href="/marketplace">
            <Button variant="outline" className="px-6 py-3 border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 inline-flex items-center transition-colors">
              <span>Browse All Listings</span>
              <i className="ri-arrow-right-line ml-2"></i>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedListings;
