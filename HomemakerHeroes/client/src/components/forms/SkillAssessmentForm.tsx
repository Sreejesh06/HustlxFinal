import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";

interface SkillAssessmentFormProps {
  userId: number;
}

// Create separate schemas for each step
const step1Schema = z.object({
  experience: z.string().min(10, "Please share some details about your experience"),
  education: z.string().optional(),
  previousWork: z.string().optional(),
});

const step2Schema = z.object({
  interests: z.array(z.string()).min(1, "Please select at least one interest"),
  skills: z.string().min(10, "Please share some details about your skills"),
});

const step3Schema = z.object({
  workStyle: z.enum(["independent", "collaborative", "mix"]),
  schedule: z.enum(["flexible", "structured", "mix"]),
  challenges: z.string().min(10, "Please share some challenges you face"),
});

const step4Schema = z.object({
  businessGoals: z.string().min(10, "Please share your business goals"),
  incomeTarget: z.enum(["extra", "part_time", "full_time"]),
});

// Combined schema for final submission
const assessmentSchema = z.object({
  // Section 1: Background
  experience: z.string().min(10, "Please share some details about your experience"),
  education: z.string().optional(),
  previousWork: z.string().optional(),
  
  // Section 2: Interests & Skills
  interests: z.array(z.string()).min(1, "Please select at least one interest"),
  skills: z.string().min(10, "Please share some details about your skills"),
  
  // Section 3: Personality & Preferences
  workStyle: z.enum(["independent", "collaborative", "mix"]),
  schedule: z.enum(["flexible", "structured", "mix"]),
  challenges: z.string().min(10, "Please share some challenges you face"),
  
  // Section 4: Goals
  businessGoals: z.string().min(10, "Please share your business goals"),
  incomeTarget: z.enum(["extra", "part_time", "full_time"]),
});

export default function SkillAssessmentForm({ userId }: SkillAssessmentFormProps) {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assessmentResults, setAssessmentResults] = useState<any>(null);
  
  // Create a dynamic resolver that changes based on the current step
  const stepResolver = (currentStep: number) => {
    return async (values: any, context: any, options: any) => {
      // Common resolver options
      const resolverOptions = { 
        ...options, 
        abortEarly: false // We want to collect all errors
      };
      
      // Only validate the fields for the current step
      let schema;
      switch (currentStep) {
        case 1:
          schema = step1Schema;
          break;
        case 2:
          schema = step2Schema;
          break;
        case 3:
          schema = step3Schema;
          break;
        case 4:
          schema = step4Schema;
          break;
        default:
          schema = assessmentSchema; // Fallback to full schema
      }
      
      try {
        // Create a zodResolver for the current step's schema
        const result = await schema.parseAsync(values);
        return {
          values: result,
          errors: {}
        };
      } catch (error) {
        // Format zod errors to match react-hook-form expectation
        if (error instanceof z.ZodError) {
          const errors = error.format();
          const formattedErrors: Record<string, { message: string }> = {};
          
          Object.entries(errors).forEach(([key, value]) => {
            if (key !== '_errors' && typeof value === 'object' && value !== null && '_errors' in value) {
              const errorsArray = (value as { _errors: string[] })._errors;
              if (errorsArray.length > 0) {
                formattedErrors[key] = { message: errorsArray[0] };
              }
            }
          });
          
          return {
            values: {},
            errors: formattedErrors
          };
        }
        
        // Non-zod errors
        return {
          values: {},
          errors: { root: { message: 'Validation failed' } }
        };
      }
    };
  };

  const form = useForm<z.infer<typeof assessmentSchema>>({
    resolver: stepResolver(currentStep),
    defaultValues: {
      experience: "",
      education: "",
      previousWork: "",
      interests: [],
      skills: "",
      workStyle: "mix",
      schedule: "flexible",
      challenges: "",
      businessGoals: "",
      incomeTarget: "extra",
    },
  });
  
  // Update the form resolver when currentStep changes
  useEffect(() => {
    form.clearErrors();
  }, [currentStep, form]);
  
  const assessmentMutation = useMutation({
    mutationFn: async (data: z.infer<typeof assessmentSchema>) => {
      setIsSubmitting(true);
      const res = await apiRequest("POST", "/api/assessments", data);
      return res.json();
    },
    onSuccess: (data) => {
      setAssessmentResults(data);
      toast({
        title: "Assessment submitted successfully",
        description: "We've analyzed your responses and have some suggestions for you!",
      });
      setIsSubmitting(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit assessment. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    },
  });
  
  const validateCurrentStep = async () => {
    let isValid = false;
    const currentData = form.getValues();
    
    try {
      // Validate only the fields for the current step
      switch (currentStep) {
        case 1:
          await step1Schema.parseAsync({
            experience: currentData.experience,
            education: currentData.education,
            previousWork: currentData.previousWork,
          });
          isValid = true;
          break;
        case 2:
          await step2Schema.parseAsync({
            interests: currentData.interests,
            skills: currentData.skills,
          });
          isValid = true;
          break;
        case 3:
          await step3Schema.parseAsync({
            workStyle: currentData.workStyle,
            schedule: currentData.schedule,
            challenges: currentData.challenges,
          });
          isValid = true;
          break;
        case 4:
          await step4Schema.parseAsync({
            businessGoals: currentData.businessGoals,
            incomeTarget: currentData.incomeTarget,
          });
          isValid = true;
          break;
      }
      
      return isValid;
    } catch (error) {
      // The error contains validation issues
      return false;
    }
  };

  const onSubmit = async (data: z.infer<typeof assessmentSchema>) => {
    if (currentStep < 4) {
      const isStepValid = await validateCurrentStep();
      if (isStepValid) {
        setCurrentStep(currentStep + 1);
      } else {
        // Let the form validation errors show
        form.trigger();
      }
      return;
    }
    
    // Final submission - validate the current step first
    const isStepValid = await validateCurrentStep();
    if (isStepValid) {
      assessmentMutation.mutate(data);
    }
  };
  
  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const interestOptions = [
    { id: "cooking", label: "Cooking & Baking" },
    { id: "crafts", label: "Arts & Crafts" },
    { id: "teaching", label: "Teaching & Education" },
    { id: "writing", label: "Writing & Content Creation" },
    { id: "organizing", label: "Home Organization" },
    { id: "gardening", label: "Gardening" },
    { id: "design", label: "Design & Decoration" },
    { id: "fashion", label: "Fashion & Sewing" },
    { id: "childcare", label: "Childcare & Parenting" },
    { id: "digital", label: "Digital Skills" },
    { id: "wellness", label: "Health & Wellness" },
    { id: "events", label: "Event Planning" }
  ];
  
  // When assessment completes, show results instead of form
  if (assessmentResults) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-lightbulb-flash-line text-primary text-2xl"></i>
          </div>
          <h2 className="text-xl font-semibold mb-2">Your Skill Assessment Results</h2>
          <p className="text-neutral-600 max-w-md mx-auto">
            Based on your responses, we've identified these skills that you could monetize:
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {assessmentResults.skillSuggestions.map((skill: any, index: number) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-5">
                <div className="flex items-start mb-3">
                  <i className={`${skill.icon} text-xl text-primary p-2 bg-primary-light bg-opacity-20 rounded-md`}></i>
                  <div className="ml-3">
                    <h3 className="font-headings font-semibold">{skill.name}</h3>
                    <p className="text-sm text-neutral-600">{skill.matchPercentage}% match</p>
                  </div>
                </div>
                <p className="text-sm text-neutral-700 mb-3">{skill.description}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {skill.tags.map((tag: string, i: number) => (
                    <span key={i} className="px-2 py-1 bg-neutral-100 text-neutral-700 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="bg-blue-50 border-l-4 border-blue-300 p-4 rounded-r-md">
          <div className="flex items-start">
            <i className="ri-lightbulb-line text-blue-500 mt-0.5"></i>
            <div className="ml-2">
              <p className="text-sm text-blue-800 font-medium">Business Insight</p>
              <p className="text-sm text-blue-700">
                {assessmentResults.businessInsights}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center space-x-4">
          <Button 
            variant="outline"
            onClick={() => navigate('/dashboard')}
          >
            Go to Dashboard
          </Button>
          <Button 
            className="bg-primary hover:bg-primary-dark text-white"
            onClick={() => navigate('/profile-setup')}
          >
            Complete Your Profile
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-neutral-600">Step {currentStep} of 4</span>
            <span className="text-sm font-medium text-primary">{currentStep * 25}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${currentStep * 25}%` }}></div>
          </div>
        </div>
        
        {/* Step 1: Background */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-neutral-800">Your Background</h2>
            
            <FormField
              control={form.control}
              name="experience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tell us about your experience as a homemaker</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="How many years of experience do you have? What responsibilities do you manage at home? What are you most proud of?" 
                      className="min-h-32" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Your experience at home often translates to valuable marketable skills
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="education"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Education & Training (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="What formal education or training do you have? Include degrees, certifications, or workshops." 
                      className="min-h-20" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="previousWork"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Previous Work Experience (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="What jobs have you held in the past? What skills did you develop there?" 
                      className="min-h-20" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
        
        {/* Step 2: Interests & Skills */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-neutral-800">Your Interests & Skills</h2>
            
            <FormField
              control={form.control}
              name="interests"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">What are your interests?</FormLabel>
                    <FormDescription>
                      Select all that apply. These often reveal marketable talents.
                    </FormDescription>
                  </div>
                  {interestOptions.map((interest) => (
                    <FormField
                      key={interest.id}
                      control={form.control}
                      name="interests"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={interest.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(interest.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, interest.id])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== interest.id
                                        )
                                      )
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {interest.label}
                            </FormLabel>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="skills"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What skills have you developed that others compliment you on?</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="What are you good at? What do friends or family ask for your help with? What comes naturally to you?" 
                      className="min-h-32" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Be specific: Instead of "cooking," mention "creating custom birthday cakes" or "developing healthy meal plans"
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
        
        {/* Step 3: Personality & Preferences */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-neutral-800">Your Work Style & Preferences</h2>
            
            <FormField
              control={form.control}
              name="workStyle"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>How do you prefer to work?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="independent" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          I prefer working independently
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="collaborative" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          I prefer collaborating with others
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="mix" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          I enjoy a mix of both
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="schedule"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>What type of schedule works best for you?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="flexible" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          I need a flexible schedule that works around family responsibilities
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="structured" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          I prefer a structured, predictable schedule
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="mix" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          I can work with a mix of both
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="challenges"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What challenges do you face in starting or growing a business?</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="What obstacles are you facing? What concerns do you have? What resources do you need?" 
                      className="min-h-20" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
        
        {/* Step 4: Goals */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-neutral-800">Your Business Goals</h2>
            
            <FormField
              control={form.control}
              name="businessGoals"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What do you hope to achieve with your home-based business?</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="What are your short-term and long-term goals? What does success look like to you?" 
                      className="min-h-32" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="incomeTarget"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>What income level are you targeting?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="extra" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Extra income (supplemental to household income)
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="part_time" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Part-time income (significant contribution)
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="full_time" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Full-time income (primary earner)
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
        
        <div className="flex justify-between pt-4 border-t">
          {currentStep > 1 ? (
            <Button 
              type="button" 
              variant="outline"
              onClick={goToPreviousStep}
            >
              Previous Step
            </Button>
          ) : (
            <div></div> // Empty div to maintain layout
          )}
          
          <Button 
            type="submit" 
            className="bg-primary hover:bg-primary-dark text-white"
            disabled={isSubmitting}
          >
            {currentStep < 4 
              ? "Next Step" 
              : isSubmitting 
                ? "Analyzing..." 
                : "Submit Assessment"
            }
          </Button>
        </div>
      </form>
    </Form>
  );
}
