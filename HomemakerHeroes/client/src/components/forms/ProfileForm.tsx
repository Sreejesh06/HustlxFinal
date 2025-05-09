import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { User } from "@/lib/types";

interface ProfileFormProps {
  user: User;
  section: "basic" | "skills" | "portfolio";
}

const basicProfileSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  bio: z.string().optional(),
  profileImage: z.string().optional(),
});

const skillsProfileSchema = z.object({
  experience: z.string().min(10, "Please describe your experience"),
  interests: z.string().min(10, "Please describe your interests"),
  goals: z.string().min(10, "Please describe your goals"),
});

const portfolioProfileSchema = z.object({
  portfolioItems: z.array(
    z.object({
      title: z.string().min(2, "Title is required"),
      description: z.string().optional(),
      imageUrl: z.string().optional(),
    })
  ).min(1, "Add at least one portfolio item"),
});

export default function ProfileForm({ user, section }: ProfileFormProps) {
  const { toast } = useToast();
  
  // Select the correct schema based on section
  let schema: any;
  if (section === "basic") {
    schema = basicProfileSchema;
  } else if (section === "skills") {
    schema = skillsProfileSchema;
  } else {
    schema = portfolioProfileSchema;
  }
  
  // Initialize form with user data
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: section === "basic" 
      ? {
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          email: user.email || "",
          bio: user.bio || "",
          profileImage: user.profileImage || "",
        }
      : section === "skills"
      ? {
          experience: "",
          interests: "",
          goals: "",
        }
      : {
          portfolioItems: [{ title: "", description: "", imageUrl: "" }],
        },
  });
  
  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("PATCH", `/api/users/${user.id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
      
      // If profile completion is not already 100%, increment it
      if (user.profileCompletionPercentage < 100) {
        const newCompletion = Math.min(100, (user.profileCompletionPercentage || 0) + 10);
        apiRequest("PATCH", `/api/users/${user.id}`, { profileCompletionPercentage: newCompletion });
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = (data: z.infer<typeof schema>) => {
    updateProfileMutation.mutate(data);
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {section === "basic" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your first name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="your.email@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="profileImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/your-image.jpg" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter a URL for your profile image
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Tell us about yourself and your background" 
                      className="min-h-32" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    This helps customers and mentors understand your background and expertise
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
        
        {section === "skills" && (
          <>
            <FormField
              control={form.control}
              name="experience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Professional & Life Experience</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your work history, education, and life experiences that have given you valuable skills" 
                      className="min-h-32" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Include both formal work and informal experiences (e.g., managing a household, volunteering)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="interests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interests & Hobbies</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="What are you passionate about? What do you enjoy doing in your free time?" 
                      className="min-h-32" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Your interests often reveal hidden talents that could be monetized
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="goals"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Goals</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="What are you hoping to achieve with your business? What are your short-term and long-term goals?" 
                      className="min-h-32" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Understanding your goals helps us match you with the right opportunities and mentors
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
        
        {section === "portfolio" && (
          <div className="space-y-6">
            <div className="bg-blue-50 border-l-4 border-blue-300 p-4 rounded-r-md">
              <div className="flex items-start">
                <i className="ri-information-line text-blue-500 mt-0.5"></i>
                <div className="ml-2">
                  <p className="text-sm text-blue-800 font-medium">Portfolio Samples</p>
                  <p className="text-sm text-blue-700">
                    Add examples of your work to showcase your skills. Photos, descriptions, or links to past projects will help build trust with potential clients.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              {[1, 2, 3].map((item) => (
                <div key={item} className="border border-neutral-200 rounded-lg p-4">
                  <h3 className="font-medium mb-4">Portfolio Item {item}</h3>
                  
                  <div className="space-y-4">
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder={`Portfolio item ${item} title`} />
                      </FormControl>
                    </FormItem>
                    
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe this item, when you created it, and any special techniques used" 
                          className="min-h-20" 
                        />
                      </FormControl>
                    </FormItem>
                    
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/portfolio-image.jpg" />
                      </FormControl>
                      <FormDescription>
                        Enter a URL for your portfolio image
                      </FormDescription>
                    </FormItem>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex justify-end space-x-3">
          <Button type="button" variant="outline">Cancel</Button>
          <Button 
            type="submit" 
            className="bg-primary hover:bg-primary-dark text-white"
            disabled={updateProfileMutation.isPending}
          >
            {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
