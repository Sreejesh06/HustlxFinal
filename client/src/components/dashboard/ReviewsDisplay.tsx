import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Star, 
  StarHalf, 
  MessageSquare, 
  Calendar 
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface Review {
  id: number;
  listingId: number;
  authorId: number;
  recipientId: number;
  rating: number;
  comment?: string;
  createdAt: string;
  author?: {
    username: string;
    profilePicture?: string;
  };
  recipient?: {
    username: string;
    profilePicture?: string;
  };
  listing?: {
    title: string;
  };
}

interface ReviewsDisplayProps {
  reviews: Review[];
  compact?: boolean;
  isOwn?: boolean;
}

const ReviewsDisplay = ({ reviews, compact = false, isOwn = false }: ReviewsDisplayProps) => {
  // Get users info if not already included in the reviews
  const { data: authors } = useQuery({
    queryKey: ['/api/users', ...reviews.map(r => r.authorId)],
    enabled: !reviews.some(r => r.author),
  });

  const { data: recipients } = useQuery({
    queryKey: ['/api/users', ...reviews.map(r => r.recipientId)],
    enabled: !reviews.some(r => r.recipient) && !isOwn,
  });

  const { data: listings } = useQuery({
    queryKey: ['/api/listings', ...reviews.map(r => r.listingId)],
    enabled: !reviews.some(r => r.listing),
  });

  // Render star rating
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star 
          key={`full-${i}`} 
          className="h-4 w-4 text-yellow-400 fill-yellow-400" 
        />
      );
    }
    
    // Add half star if needed
    if (hasHalfStar) {
      stars.push(
        <StarHalf 
          key="half" 
          className="h-4 w-4 text-yellow-400 fill-yellow-400" 
        />
      );
    }
    
    // Add empty stars
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star 
          key={`empty-${i}`} 
          className="h-4 w-4 text-gray-300" 
        />
      );
    }
    
    return stars;
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  // Get user data from review or fetched users
  const getUserData = (review: Review, isAuthor: boolean) => {
    if (isAuthor) {
      return review.author || (authors?.find(a => a.id === review.authorId));
    } else {
      return review.recipient || (recipients?.find(r => r.id === review.recipientId));
    }
  };

  // Get listing data
  const getListingData = (review: Review) => {
    return review.listing || (listings?.find(l => l.id === review.listingId));
  };

  // Get avatar elements for a user
  const getAvatar = (userId: number, isAuthor: boolean) => {
    const user = isAuthor 
      ? authors?.find(a => a.id === userId) 
      : recipients?.find(r => r.id === userId);
    
    const fallbackText = user?.username?.[0].toUpperCase() || (isAuthor ? 'C' : 'H');
    
    return (
      <Avatar>
        <AvatarImage src={user?.profilePicture} alt={user?.username || 'User'} />
        <AvatarFallback>{fallbackText}</AvatarFallback>
      </Avatar>
    );
  };

  return (
    <div className="space-y-4">
      {reviews.length === 0 ? (
        <div className="text-center py-4 text-muted-foreground">
          <p>No reviews yet.</p>
        </div>
      ) : (
        reviews.map((review) => {
          const authorData = getUserData(review, true);
          const recipientData = getUserData(review, false);
          const listingData = getListingData(review);

          return (
            <Card key={review.id} className="overflow-hidden">
              <CardContent className={`p-4 ${compact ? '' : 'p-6'}`}>
                <div className="flex items-start gap-4">
                  {!compact && (
                    <div className="flex-shrink-0">
                      {isOwn 
                        ? getAvatar(review.recipientId, false)
                        : getAvatar(review.authorId, true)
                      }
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div>
                        <h4 className="font-medium">
                          {isOwn
                            ? `Review for ${recipientData?.username || `Homemaker #${review.recipientId}`}`
                            : authorData?.username || `Customer #${review.authorId}`
                          }
                        </h4>
                        <div className="flex items-center mt-1">
                          <div className="flex">{renderStars(review.rating)}</div>
                          <span className="ml-2 text-sm text-muted-foreground">
                            {review.rating.toFixed(1)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5 mr-1" />
                        {formatDate(review.createdAt)}
                      </div>
                    </div>
                    
                    {listingData && (
                      <div className="mt-1 text-sm">
                        <span className="text-muted-foreground">
                          {isOwn ? 'Your review for:' : 'Review for:'} 
                        </span>{' '}
                        <span className="font-medium">
                          {listingData.title || `Listing #${review.listingId}`}
                        </span>
                      </div>
                    )}
                    
                    {review.comment && (
                      <div className="mt-2">
                        <div className="flex items-start">
                          <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5 mr-2 flex-shrink-0" />
                          <p className="text-sm text-gray-600">{review.comment}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
};

export default ReviewsDisplay;
