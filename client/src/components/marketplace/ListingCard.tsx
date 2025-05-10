import { useState } from 'react';
import { Link } from 'wouter';
import { Star, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

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

interface User {
  id: number;
  username: string;
  profilePicture?: string;
}

interface ListingCardProps {
  listing: Listing;
  homemakerInfo?: User;
  compact?: boolean;
}

const ListingCard = ({ listing, homemakerInfo, compact = false }: ListingCardProps) => {
  const { toast } = useToast();
  const { isAuthenticated, setShowLoginModal } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  // Format currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price / 100); // Price is stored in cents
  };
  
  // Handle booking/purchase
  const handleAction = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to book this service or purchase this product.",
      });
      setShowLoginModal(true);
      return;
    }
    
    // Navigate to the listing detail page with a highlighted action button
    window.location.href = `/listing/${listing.id}?action=true`;
  };
  
  // Determine the action button text based on the listing type
  const actionText = listing.type === 'service' ? 'Book Now' : 'Shop Now';
  
  // Generate a placeholder rating if not provided
  const rating = 4.7 + Math.random() * 0.3;
  const reviewCount = Math.floor(Math.random() * 50) + 5;
  
  // If no images are provided, use a placeholder based on category
  const getImageUrl = () => {
    if (listing.images && listing.images.length > 0) {
      return listing.images[0];
    }
    
    // Default category images
    const categoryImages: Record<string, string> = {
      'Cooking & Baking': 'https://pixabay.com/get/g43dd09324618f072b657fbb3b35a5a752c562ca1e39e575a8de7cddbc6d75192c5dd0f53cbd4e2e38d53a4ffedb0235f5f100716213ad58a30e6ecec5e46c644_1280.jpg',
      'Crafts & Handmade': 'https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      'Tutoring': 'https://pixabay.com/get/gb50e31b92ce5e28e368eb0b35bd25e58219a2017a685c5232f52b079fe67c825f85bfcef45e23e0940d498ffe1558a4e9a8588d3a7c7332d4d9a1b7d12800e24_1280.jpg',
    };
    
    return categoryImages[listing.category] || 'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';
  };
  
  // Placeholder user image if homemaker info not provided
  const getUserImage = () => {
    if (homemakerInfo?.profilePicture) {
      return homemakerInfo.profilePicture;
    }
    return 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80';
  };
  
  const userName = homemakerInfo?.username || 'Homemaker';
  
  return (
    <Card className="bg-white rounded-xl overflow-hidden shadow-md transition-transform hover:shadow-lg">
      <Link href={`/listing/${listing.id}`}>
        <div className="relative cursor-pointer">
          <img 
            src={getImageUrl()} 
            alt={listing.title} 
            className={`w-full object-cover ${compact ? 'h-36' : 'h-48'}`}
          />
          {listing.isFeatured && (
            <div className="absolute top-3 left-3 bg-accent text-xs font-bold px-2 py-1 rounded text-white">
              FEATURED
            </div>
          )}
          <div className="absolute top-3 right-3 bg-white bg-opacity-90 text-xs font-bold px-2 py-1 rounded-full flex items-center">
            <Star className="text-yellow-400 mr-1 h-3 w-3 fill-yellow-400" />
            <span>{rating.toFixed(1)} ({reviewCount})</span>
          </div>
        </div>
      </Link>
      
      <CardContent className={compact ? 'p-3' : 'p-5'}>
        <div className="flex items-center mb-3">
          <img 
            src={getUserImage()} 
            alt={userName}
            className="w-8 h-8 rounded-full mr-2 object-cover" 
          />
          <span className="text-sm text-gray-600">{userName}</span>
          <div className="ml-auto flex items-center text-xs">
            <Badge variant="secondary" className="bg-primary text-white">
              <CheckCircle className="mr-1 h-3 w-3" />
              AI Verified
            </Badge>
          </div>
        </div>
        
        <Link href={`/listing/${listing.id}`}>
          <h3 className={`font-heading font-semibold ${compact ? 'text-base' : 'text-lg'} mb-2 cursor-pointer hover:text-primary transition-colors`}>
            {listing.title}
          </h3>
        </Link>
        
        <div className="flex flex-wrap gap-2 mb-3">
          {listing.category && (
            <Badge variant="outline" className="bg-primary-light bg-opacity-10 text-primary border-none">
              {listing.category}
            </Badge>
          )}
          {listing.subcategory && (
            <Badge variant="outline" className="bg-primary-light bg-opacity-10 text-primary border-none">
              {listing.subcategory}
            </Badge>
          )}
          {listing.tags && listing.tags.slice(0, 2).map((tag, index) => (
            <Badge key={index} variant="outline" className="bg-primary-light bg-opacity-10 text-primary border-none">
              {tag}
            </Badge>
          ))}
        </div>
        
        {!compact && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{listing.description}</p>
        )}
        
        <div className="flex justify-between items-center">
          <span className="font-bold text-lg">
            {formatPrice(listing.price)}
            {listing.type === 'service' && (
              <span className="text-sm font-normal text-gray-600">
                {listing.type === 'service' ? '/session' : ''}
              </span>
            )}
          </span>
          
          {!compact && (
            <Button 
              onClick={handleAction}
              className={`${listing.type === 'service' ? 'bg-primary' : 'bg-secondary'} text-white hover:${listing.type === 'service' ? 'bg-primary-dark' : 'bg-secondary-dark'} transition`}
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : actionText}
            </Button>
          )}
        </div>
      </CardContent>
      
      {compact && (
        <CardFooter className="p-3 pt-0">
          <Button 
            onClick={handleAction}
            className={`w-full ${listing.type === 'service' ? 'bg-primary' : 'bg-secondary'} text-white hover:${listing.type === 'service' ? 'bg-primary-dark' : 'bg-secondary-dark'} transition`}
            disabled={isLoading}
            size="sm"
          >
            {isLoading ? 'Loading...' : actionText}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default ListingCard;
