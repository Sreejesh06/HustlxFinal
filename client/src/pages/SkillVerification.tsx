import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation, useRoute } from "wouter";
import { Helmet } from "react-helmet";
import { 
  Shield, 
  Upload, 
  BadgeCheck, 
  FileQuestion,
  ArrowRight,
  CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import SkillAssessmentForm from "@/components/skills/SkillAssessmentForm";
import SkillBadge from "@/components/skills/SkillBadge";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

export default function SkillVerification() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { isAuthenticated, user, setShowLoginModal } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [creatingSkill, setCreatingSkill] = useState(false);
  const [skillName, setSkillName] = useState("");
  const [skillCategory, setSkillCategory] = useState("");
  
  // Check if user is authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in as a homemaker to access skill verification.",
      });
      setShowLoginModal(true);
    } else if (user?.role !== "homemaker") {
      toast({
        title: "Homemaker account required",
        description: "Only homemakers can verify their skills.",
      });
      setLocation("/");
    }
  }, [isAuthenticated, user, toast, setShowLoginModal, setLocation]);
  
  // Fetch user skills
  const { data: skills, isLoading: skillsLoading, refetch: refetchSkills } = useQuery({
    queryKey: [isAuthenticated && user?.id ? `/api/homemakers/${user.id}/skills` : null],
    enabled: isAuthenticated && user?.role === "homemaker",
  });
  
  // Create skill mutation
  const createSkillMutation = useMutation({
    mutationFn: (data: { name: string; category: string }) => {
      return apiRequest("POST", "/api/skills", data);
    },
    onSuccess: (data) => {
      toast({
        title: "Skill created",
        description: "Your skill has been created and is ready for verification.",
      });
      setCreatingSkill(false);
      refetchSkills();
      setActiveTab("verify");
    },
    onError: (error: Error) => {
      toast({
        title: "Error creating skill",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Handle skill creation
  const handleCreateSkill = () => {
    if (!skillName || !skillCategory) {
      toast({
        title: "Missing information",
        description: "Please provide both skill name and category.",
        variant: "destructive",
      });
      return;
    }
    
    createSkillMutation.mutate({
      name: skillName,
      category: skillCategory,
    });
  };
  
  // Handle skill verification completion
  const handleVerificationComplete = (result: any) => {
    toast({
      title: "Skill verified!",
      description: `Your ${result.skill.name} skill has been verified at level ${result.skill.level}.`,
    });
    refetchSkills();
    setActiveTab("overview");
  };
  
  // The categories available for skill creation
  const categories = [
    "Cooking & Baking",
    "Crafts & Handmade",
    "Tutoring & Teaching",
    "Beauty & Wellness",
    "Home Services",
    "Music & Performance",
    "Art & Design",
    "Language & Translation",
    "Other"
  ];

  // If not authenticated, show a placeholder with login prompt
  if (!isAuthenticated || user?.role !== "homemaker") {
    return (
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <Card className="mx-auto max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Skill Verification</CardTitle>
            <CardDescription className="text-center">
              You need to be logged in as a homemaker to access this page.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center py-6">
              <Shield className="mx-auto h-12 w-12 text-primary opacity-70 mb-4" />
              <h3 className="text-lg font-medium">Authentication Required</h3>
              <p className="text-muted-foreground mt-2 mb-6">
                Please log in with a homemaker account to verify your skills.
              </p>
              <Button onClick={() => setShowLoginModal(true)}>Log In</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <>
      <Helmet>
        <title>Skill Verification | EmpowerHer</title>
        <meta name="description" content="Verify your homemaking skills with our AI-powered assessment system to build credibility and attract more customers." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Skill Verification</h1>
            <p className="text-muted-foreground mt-1">
              Get your homemaking skills verified by our AI assessment system
            </p>
          </div>
          
          <div className="mt-4 md:mt-0">
            {!creatingSkill && activeTab !== "create" && (
              <Button onClick={() => setActiveTab("create")} className="flex items-center">
                <BadgeCheck className="mr-2 h-4 w-4" />
                Add New Skill
              </Button>
            )}
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-3 w-full md:w-auto">
            <TabsTrigger value="overview">My Skills</TabsTrigger>
            <TabsTrigger value="create">Add Skill</TabsTrigger>
            <TabsTrigger value="verify">Verify Skill</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Skills</CardTitle>
                <CardDescription>
                  All your skills, both verified and pending verification
                </CardDescription>
              </CardHeader>
              <CardContent>
                {skillsLoading ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {Array(5).fill(0).map((_, i) => (
                      <Skeleton key={i} className="h-32 w-full rounded-lg" />
                    ))}
                  </div>
                ) : skills?.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {skills.map((skill: any) => (
                      <SkillBadge
                        key={skill.id}
                        name={skill.name}
                        category={skill.category}
                        level={skill.level}
                        isVerified={skill.isVerified}
                        clickable
                        onClick={() => {
                          if (!skill.isVerified) {
                            setActiveTab("verify");
                          }
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <FileQuestion className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No skills found</h3>
                    <p className="text-muted-foreground mt-2 mb-6">
                      You haven't added any skills yet. Add a skill to get started.
                    </p>
                    <Button onClick={() => setActiveTab("create")}>
                      Add Your First Skill
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>How Skill Verification Works</CardTitle>
                <CardDescription>
                  Our AI-powered system evaluates your skills and provides credibility
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex flex-col items-center text-center p-4 rounded-lg bg-slate-50">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <Upload className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-medium mb-2">Upload Samples</h3>
                    <p className="text-sm text-muted-foreground">
                      Upload videos, images, or audio samples of your work for AI analysis
                    </p>
                  </div>
                  
                  <div className="flex flex-col items-center text-center p-4 rounded-lg bg-slate-50">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <FileQuestion className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-medium mb-2">Answer Questions</h3>
                    <p className="text-sm text-muted-foreground">
                      Complete a skill-specific questionnaire to demonstrate your knowledge
                    </p>
                  </div>
                  
                  <div className="flex flex-col items-center text-center p-4 rounded-lg bg-slate-50">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <BadgeCheck className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-medium mb-2">Get Verified</h3>
                    <p className="text-sm text-muted-foreground">
                      Receive a verified skill badge with level rating to display on your profile
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="create" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add a New Skill</CardTitle>
                <CardDescription>
                  Add a skill you want to get verified
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="skill-name" className="block text-sm font-medium text-gray-700 mb-1">
                      Skill Name
                    </label>
                    <input
                      id="skill-name"
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                      placeholder="e.g., Cake Baking, Math Tutoring, Knitting"
                      value={skillName}
                      onChange={(e) => setSkillName(e.target.value)}
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Enter a specific skill that describes what you do
                    </p>
                  </div>
                  
                  <div>
                    <label htmlFor="skill-category" className="block text-sm font-medium text-gray-700 mb-1">
                      Skill Category
                    </label>
                    <select
                      id="skill-category"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                      value={skillCategory}
                      onChange={(e) => setSkillCategory(e.target.value)}
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    <p className="mt-1 text-sm text-gray-500">
                      Choose the category that best fits your skill
                    </p>
                  </div>
                </div>
                
                <Alert className="bg-yellow-50 border-yellow-200">
                  <AlertTitle className="text-yellow-800 flex items-center gap-2">
                    <BadgeCheck className="h-4 w-4" />
                    Ready for verification?
                  </AlertTitle>
                  <AlertDescription className="text-yellow-700">
                    After adding your skill, you'll proceed to the verification process where you'll 
                    upload samples and answer questions about your expertise.
                  </AlertDescription>
                </Alert>
                
                <div className="flex justify-end space-x-4">
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab("overview")}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateSkill}
                    disabled={!skillName || !skillCategory || createSkillMutation.isPending}
                  >
                    {createSkillMutation.isPending ? (
                      "Creating..."
                    ) : (
                      <>
                        Add Skill and Continue
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="verify" className="space-y-6">
            {skillsLoading ? (
              <Skeleton className="h-[600px] w-full" />
            ) : (skills?.filter((s: any) => !s.isVerified).length > 0) ? (
              <>
                <Card className="mb-4">
                  <CardHeader>
                    <CardTitle>Select a Skill to Verify</CardTitle>
                    <CardDescription>
                      Choose one of your unverified skills to begin the assessment
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {skills
                        .filter((skill: any) => !skill.isVerified)
                        .map((skill: any) => (
                          <SkillBadge
                            key={skill.id}
                            name={skill.name}
                            category={skill.category}
                            level={skill.level}
                            isVerified={false}
                            clickable
                            size="md"
                            onClick={() => {
                              // Set state to pass to the verification form
                              // TODO: Implement the actual verification form with selected skill
                            }}
                          />
                        ))}
                    </div>
                  </CardContent>
                </Card>
                
                <SkillAssessmentForm 
                  onComplete={handleVerificationComplete}
                  skillId={skills.find((s: any) => !s.isVerified)?.id}
                />
              </>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">All Skills Verified!</h3>
                  <p className="text-muted-foreground mb-6">
                    Great job! All your skills have been verified. Add more skills to continue growing your profile.
                  </p>
                  <Button onClick={() => setActiveTab("create")}>
                    Add Another Skill
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
