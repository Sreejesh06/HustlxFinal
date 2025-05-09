import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SkillSuggestion } from "@/lib/types";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface SkillSuggestionSectionProps {
  suggestions: SkillSuggestion[];
  isLoading: boolean;
}

export default function SkillSuggestionSection({ 
  suggestions, 
  isLoading 
}: SkillSuggestionSectionProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const addSkillMutation = useMutation({
    mutationFn: async (data: { name: string; description: string; confidenceLevel: number; isAiSuggested: boolean; userId: number }) => {
      const res = await apiRequest("POST", "/api/skills", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${user?.id}/skills`] });
      toast({
        title: "Skill added",
        description: "The skill has been added to your profile.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add skill. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  const handleAddSkill = (suggestion: SkillSuggestion) => {
    if (!user) return;
    
    addSkillMutation.mutate({
      name: suggestion.name,
      description: suggestion.description,
      confidenceLevel: Math.floor(suggestion.matchPercentage / 10),
      isAiSuggested: true,
      userId: user.id
    });
  };
  
  if (isLoading) {
    return (
      <section className="mb-10">
        <Skeleton className="h-96 w-full" />
      </section>
    );
  }
  
  // If there are no suggestions yet, show a prompt to take the assessment
  if (suggestions.length === 0) {
    return (
      <section className="mb-10">
        <div className="bg-white rounded-xl shadow-sm p-5 border border-neutral-200">
          <div className="text-center p-8">
            <div className="w-16 h-16 mx-auto bg-accent bg-opacity-10 rounded-full flex items-center justify-center mb-4">
              <i className="ri-lightbulb-flash-line text-accent text-2xl"></i>
            </div>
            <h2 className="text-xl font-headings font-semibold text-neutral-800 mb-2">
              Discover Your Monetizable Skills
            </h2>
            <p className="text-neutral-600 max-w-md mx-auto mb-6">
              Take our skill assessment to get personalized AI suggestions for skills you can monetize based on your experience and interests.
            </p>
            <Button 
              variant="default"
              className="bg-primary hover:bg-primary-dark text-white"
              onClick={() => window.location.href = "/skill-assessment"}
            >
              Take Skill Assessment
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-10">
      <div className="bg-white rounded-xl shadow-sm p-5 border border-neutral-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-headings font-semibold text-neutral-800 flex items-center">
              <i className="ri-lightbulb-flash-line text-accent mr-2"></i> Your AI Skill Suggestions
            </h2>
            <p className="text-neutral-600 text-sm mt-1">
              Based on your profile and activity, we've identified these talents you could monetize
            </p>
          </div>
          <a
            href="/skill-assessment"
            className="text-sm text-secondary hover:text-secondary-dark font-medium mt-2 md:mt-0 flex items-center"
          >
            Take skill assessment <i className="ri-arrow-right-line ml-1"></i>
          </a>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {suggestions.map((suggestion) => (
            <div key={suggestion.id} className="ai-suggestion rounded-lg p-4">
              <div className="flex items-start mb-3">
                <i className={`${suggestion.icon} text-xl text-primary p-2 bg-primary-light bg-opacity-20 rounded-md`}></i>
                <div className="ml-3">
                  <h3 className="font-headings font-semibold">{suggestion.name}</h3>
                  <p className="text-sm text-neutral-600">{suggestion.matchPercentage}% match with your profile</p>
                </div>
              </div>
              <p className="text-sm text-neutral-700 mb-3">{suggestion.description}</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {suggestion.tags.map((tag, index) => (
                  <span key={index} className="px-2 py-1 bg-neutral-100 text-neutral-700 rounded text-xs">
                    {tag}
                  </span>
                ))}
              </div>
              <Button
                variant="link"
                className="text-sm font-medium text-primary hover:text-primary-dark p-0 h-auto"
                onClick={() => handleAddSkill(suggestion)}
                disabled={addSkillMutation.isPending}
              >
                {addSkillMutation.isPending ? 'Adding...' : 'Add to your skills'} <i className="ri-add-line ml-1"></i>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
