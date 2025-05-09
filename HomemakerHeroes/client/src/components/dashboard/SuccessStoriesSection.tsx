import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SuccessStory } from "@/lib/types";

interface SuccessStoriesSectionProps {
  stories: SuccessStory[];
  isLoading: boolean;
}

export default function SuccessStoriesSection({
  stories,
  isLoading
}: SuccessStoriesSectionProps) {
  if (isLoading) {
    return (
      <section className="mt-10">
        <div className="flex items-baseline justify-between mb-5">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-8 w-20" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-96 w-full" />
          ))}
        </div>
      </section>
    );
  }
  
  // Show max 3 success stories
  const displayedStories = stories?.slice(0, 3) || [];
  
  if (displayedStories.length === 0) {
    return null;
  }

  return (
    <section className="mt-10">
      <div className="flex items-baseline justify-between mb-5">
        <h2 className="text-xl font-headings font-semibold text-neutral-800">Success Stories</h2>
        <Link href="/success-stories">
          <Button variant="link" className="text-sm text-secondary hover:text-secondary-dark font-medium">
            View all
          </Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {displayedStories.map((story) => (
          <Card key={story.id} className="overflow-hidden shadow-sm border-neutral-200">
            <div className="h-48 overflow-hidden">
              {story.image ? (
                <img
                  src={story.image}
                  alt={`${story.name}'s success story`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-neutral-200 flex items-center justify-center">
                  <i className="ri-image-line text-4xl text-neutral-400"></i>
                </div>
              )}
            </div>
            <CardContent className="p-5">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full overflow-hidden mr-3 bg-neutral-200 flex items-center justify-center">
                  <i className="ri-user-line text-neutral-400"></i>
                </div>
                <div>
                  <h3 className="font-medium text-neutral-800">{story.name}</h3>
                  <p className="text-sm text-neutral-600">{story.businessType}</p>
                </div>
              </div>
              <h3 className="font-headings font-semibold text-neutral-800 mb-2">
                {story.title}
              </h3>
              <p className="text-sm text-neutral-700 mb-3 line-clamp-3">
                {story.content}
              </p>
              <div className="flex flex-wrap gap-2 mb-3">
                {story.tags?.map((tag, index) => (
                  <span key={index} className="px-2 py-1 bg-neutral-100 text-neutral-700 rounded text-xs">
                    {tag}
                  </span>
                ))}
              </div>
              <Button 
                variant="link" 
                className="text-sm font-medium text-primary hover:text-primary-dark p-0 h-auto"
              >
                Read full story <i className="ri-arrow-right-line ml-1"></i>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
