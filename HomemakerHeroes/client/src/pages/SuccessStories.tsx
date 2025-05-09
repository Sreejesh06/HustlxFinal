import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SuccessStory } from "@/lib/types";

export default function SuccessStories() {
  const [searchTerm, setSearchTerm] = useState("");
  const [businessTypeFilter, setBusinessTypeFilter] = useState("all");
  
  const { data: stories, isLoading } = useQuery({
    queryKey: ['/api/success-stories'],
  });
  
  const businessTypes = [
    { value: "all", label: "All Business Types" },
    { value: "Ceramic Artist", label: "Arts & Crafts" },
    { value: "Culinary Instructor", label: "Food & Cooking" },
    { value: "Home Organization Expert", label: "Home Services" }
  ];
  
  const filteredStories = stories?.filter((story: SuccessStory) => {
    const matchesSearch = 
      story.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      story.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesBusinessType = 
      businessTypeFilter === "all" || 
      story.businessType === businessTypeFilter;
    
    return matchesSearch && matchesBusinessType;
  }) || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-neutral-800 mb-2">
          Success Stories
        </h1>
        <p className="text-neutral-600 max-w-2xl mx-auto">
          Be inspired by homemakers who have successfully transformed their talents into thriving businesses with SkillBloom
        </p>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-sm mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Input
              type="text"
              placeholder="Search success stories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"></i>
          </div>
          
          <div className="w-full md:w-64">
            <Select value={businessTypeFilter} onValueChange={setBusinessTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Business Types" />
              </SelectTrigger>
              <SelectContent>
                {businessTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-96 w-full" />
          ))}
        </div>
      ) : filteredStories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredStories.map((story: SuccessStory) => (
            <Card key={story.id} className="overflow-hidden">
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
                  className="text-primary hover:text-primary-dark p-0 h-auto"
                >
                  Read full story <i className="ri-arrow-right-line ml-1"></i>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg shadow-sm">
          <div className="mx-auto w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
            <i className="ri-search-line text-3xl text-neutral-400"></i>
          </div>
          <h3 className="text-xl font-semibold mb-2">No Stories Found</h3>
          <p className="text-neutral-600 max-w-md mx-auto mb-6">
            We couldn't find any success stories matching your search criteria. Try adjusting your filters or search terms.
          </p>
          {searchTerm || businessTypeFilter !== "all" ? (
            <Button 
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setBusinessTypeFilter("all");
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
