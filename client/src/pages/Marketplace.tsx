import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useSearch } from "wouter";
import { Helmet } from "react-helmet";
import {
  Search,
  Filter,
  X,
  ChevronDown,
  SlidersHorizontal,
  Calendar,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import CategoryFilter from "@/components/marketplace/CategoryFilter";
import ListingCard from "@/components/marketplace/ListingCard";

// Categories for filtering
const categories = [
  "All Categories",
  "Cooking & Baking",
  "Crafts & Handmade",
  "Tutoring",
  "Home Services",
  "Beauty & Wellness",
  "Music & Performance",
  "Art & Design",
  "Language & Translation",
];

export default function Marketplace() {
  const [location, setLocation] = useLocation();
  const search = useSearch();
  const [searchParams, setSearchParams] = useState<URLSearchParams>(
    new URLSearchParams(search)
  );
  
  // State for filters
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [activeCategory, setActiveCategory] = useState(searchParams.get("category") || "All Categories");
  const [listingType, setListingType] = useState(searchParams.get("type") || "all");
  const [priceRange, setPriceRange] = useState<[number, number]>([
    parseInt(searchParams.get("minPrice") || "0"),
    parseInt(searchParams.get("maxPrice") || "10000"),
  ]);
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "featured");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  
  // Fetch listings based on filters
  const { data: listings, isLoading, error } = useQuery({
    queryKey: [
      '/api/listings',
      searchQuery,
      activeCategory !== "All Categories" ? activeCategory : null,
      listingType !== "all" ? listingType : null,
      priceRange[0] > 0 ? priceRange[0] : null,
      priceRange[1] < 10000 ? priceRange[1] : null,
      sortBy,
    ],
    enabled: true,
  });
  
  // Update URL parameters when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (searchQuery) params.set("q", searchQuery);
    if (activeCategory !== "All Categories") params.set("category", activeCategory);
    if (listingType !== "all") params.set("type", listingType);
    if (priceRange[0] > 0) params.set("minPrice", priceRange[0].toString());
    if (priceRange[1] < 10000) params.set("maxPrice", priceRange[1].toString());
    if (sortBy !== "featured") params.set("sort", sortBy);
    
    setSearchParams(params);
    setLocation(`/marketplace${params.toString() ? `?${params.toString()}` : ""}`, {
      replace: true,
    });
  }, [searchQuery, activeCategory, listingType, priceRange, sortBy, setLocation]);
  
  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is already updated via state
  };
  
  // Handle category change
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };
  
  // Handle price range change
  const handlePriceRangeChange = (value: number[]) => {
    setPriceRange([value[0], value[1]]);
  };
  
  // Handle filter reset
  const handleResetFilters = () => {
    setSearchQuery("");
    setActiveCategory("All Categories");
    setListingType("all");
    setPriceRange([0, 10000]);
    setSortBy("featured");
  };
  
  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price / 100);
  };
  
  return (
    <>
      <Helmet>
        <title>Browse Services & Products | EmpowerHer Marketplace</title>
        <meta
          name="description"
          content="Discover AI-verified homemakers offering quality services and handmade products. Browse by category, filter by price, and find the perfect match for your needs."
        />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Marketplace</h1>
            <p className="text-muted-foreground mt-1">
              Discover and connect with verified homemakers
            </p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <Sheet open={isMobileFiltersOpen} onOpenChange={setIsMobileFiltersOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="outline" className="flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                  <SheetDescription>
                    Refine your search results
                  </SheetDescription>
                </SheetHeader>
                
                <div className="mt-6 space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Type</h3>
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="all-type-mobile"
                          checked={listingType === "all"}
                          onCheckedChange={() => setListingType("all")}
                        />
                        <Label htmlFor="all-type-mobile">All</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="service-type-mobile"
                          checked={listingType === "service"}
                          onCheckedChange={() => setListingType("service")}
                        />
                        <Label htmlFor="service-type-mobile">Services</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="product-type-mobile"
                          checked={listingType === "product"}
                          onCheckedChange={() => setListingType("product")}
                        />
                        <Label htmlFor="product-type-mobile">Products</Label>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Price Range</h3>
                    <div className="px-2">
                      <Slider
                        defaultValue={priceRange}
                        min={0}
                        max={10000}
                        step={100}
                        value={priceRange}
                        onValueChange={handlePriceRangeChange}
                        className="my-6"
                      />
                      <div className="flex items-center justify-between">
                        <div className="text-sm">{formatPrice(priceRange[0])}</div>
                        <div className="text-sm">{formatPrice(priceRange[1])}</div>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Sort By</h3>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="featured">Featured</SelectItem>
                        <SelectItem value="price_low">Price: Low to High</SelectItem>
                        <SelectItem value="price_high">Price: High to Low</SelectItem>
                        <SelectItem value="newest">Newest</SelectItem>
                        <SelectItem value="rating">Highest Rated</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <SheetFooter className="absolute bottom-0 left-0 right-0 p-6 border-t bg-background">
                  <div className="flex justify-between w-full">
                    <Button
                      variant="outline"
                      onClick={handleResetFilters}
                    >
                      Reset
                    </Button>
                    <SheetClose asChild>
                      <Button>Apply Filters</Button>
                    </SheetClose>
                  </div>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        
        {/* Search and Filter Bar */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <form onSubmit={handleSearch} className="flex-grow">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="search"
                  placeholder="Search for services, products, or skills..."
                  className="pl-10 pr-4 h-10 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>
            
            <div className="hidden md:flex items-center space-x-3">
              <Select value={listingType} onValueChange={setListingType}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="service">Services</SelectItem>
                  <SelectItem value="product">Products</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[170px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price_low">Price: Low to High</SelectItem>
                  <SelectItem value="price_high">Price: High to Low</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>
              
              <Button
                variant="ghost"
                onClick={handleResetFilters}
                className="text-muted-foreground"
              >
                <X className="h-4 w-4 mr-1" /> Reset
              </Button>
            </div>
          </div>
          
          {/* Category filter */}
          <CategoryFilter
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
          />
          
          {/* Active filters */}
          {(searchQuery || activeCategory !== "All Categories" || listingType !== "all" || 
            priceRange[0] > 0 || priceRange[1] < 10000) && (
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              
              {searchQuery && (
                <Badge variant="secondary" className="flex items-center gap-1 bg-primary/5 text-primary">
                  Search: {searchQuery}
                  <button onClick={() => setSearchQuery("")}>
                    <X className="h-3 w-3 ml-1" />
                  </button>
                </Badge>
              )}
              
              {activeCategory !== "All Categories" && (
                <Badge variant="secondary" className="flex items-center gap-1 bg-primary/5 text-primary">
                  Category: {activeCategory}
                  <button onClick={() => setActiveCategory("All Categories")}>
                    <X className="h-3 w-3 ml-1" />
                  </button>
                </Badge>
              )}
              
              {listingType !== "all" && (
                <Badge variant="secondary" className="flex items-center gap-1 bg-primary/5 text-primary">
                  Type: {listingType === "service" ? "Services" : "Products"}
                  <button onClick={() => setListingType("all")}>
                    <X className="h-3 w-3 ml-1" />
                  </button>
                </Badge>
              )}
              
              {(priceRange[0] > 0 || priceRange[1] < 10000) && (
                <Badge variant="secondary" className="flex items-center gap-1 bg-primary/5 text-primary">
                  Price: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                  <button onClick={() => setPriceRange([0, 10000])}>
                    <X className="h-3 w-3 ml-1" />
                  </button>
                </Badge>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                className="text-sm h-7 px-2 ml-1"
                onClick={handleResetFilters}
              >
                Clear all
              </Button>
            </div>
          )}
        </div>
        
        {/* Price range filter (desktop) */}
        <div className="hidden md:block mb-8">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">Price Range</h3>
              <div className="text-sm text-muted-foreground">
                {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
              </div>
            </div>
            <Slider
              defaultValue={priceRange}
              min={0}
              max={10000}
              step={100}
              value={priceRange}
              onValueChange={handlePriceRangeChange}
              className="my-4"
            />
          </div>
        </div>
        
        {/* Results */}
        <div className="mb-4">
          {isLoading ? (
            <div className="text-sm text-muted-foreground">Loading results...</div>
          ) : (
            <div className="text-sm text-muted-foreground">
              {listings?.length} results found
            </div>
          )}
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(9).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-[400px] w-full rounded-xl" />
            ))}
          </div>
        ) : error ? (
          <Card className="py-16 text-center">
            <CardContent>
              <h3 className="text-lg font-medium mb-2">Error loading listings</h3>
              <p className="text-muted-foreground mb-4">
                There was a problem loading the marketplace listings. Please try again.
              </p>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </CardContent>
          </Card>
        ) : listings?.length === 0 ? (
          <Card className="py-16 text-center">
            <CardContent>
              <h3 className="text-lg font-medium mb-2">No results found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your filters or search terms.
              </p>
              <Button onClick={handleResetFilters}>Clear All Filters</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing: any) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
        
        {/* Pagination placeholder for future implementation */}
        {listings?.length > 0 && (
          <div className="mt-10 flex justify-center">
            <div className="join">
              <Button variant="outline" className="join-item">
                Previous
              </Button>
              <Button variant="outline" className="join-item bg-primary text-white">
                1
              </Button>
              <Button variant="outline" className="join-item">
                2
              </Button>
              <Button variant="outline" className="join-item">
                3
              </Button>
              <Button variant="outline" className="join-item">
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
