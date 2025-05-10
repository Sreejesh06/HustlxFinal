import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { verifySkill, getSkillAssessmentQuestions } from "@/lib/groq";
import { uploadFile, isAllowedFileType, formatFileSize } from "@/lib/uploadHelpers";
import { useToast } from "@/hooks/use-toast";
import { Check, Upload, X, FileType, ImageIcon, Video, Music } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Define the form schema based on skill category
const createFormSchema = (category: string) => {
  // Base schema for skills
  const baseSchema = z.object({
    name: z.string().min(2, "Skill name must be at least 2 characters"),
    category: z.string().min(1, "Category is required"),
  });

  // This will be dynamically populated with question fields
  const questionFields: Record<string, z.ZodType<any>> = {};
  
  // Get questions for this category
  const questions = getSkillAssessmentQuestions(category);
  
  // Add each question to the schema
  questions.forEach(question => {
    if (question.type === "multiple_choice" && question.options) {
      questionFields[question.id] = z.string().min(1, "Please select an option");
    } else {
      questionFields[question.id] = z.string().min(1, "This field is required");
    }
  });

  return baseSchema.extend(questionFields);
};

interface SkillAssessmentFormProps {
  onComplete?: (result: any) => void;
  skillId?: number;
}

const SkillAssessmentForm = ({ onComplete, skillId }: SkillAssessmentFormProps) => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState("general");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedMedia, setUploadedMedia] = useState<any[]>([]);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  
  // Create a schema for the current category
  const formSchema = createFormSchema(category);
  type FormValues = z.infer<typeof formSchema>;
  
  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      category: category,
    }
  });
  
  // Get assessment questions based on selected category
  const questions = getSkillAssessmentQuestions(category);
  
  // Skill verification mutation
  const verifySkillMutation = useMutation({
    mutationFn: (data: any) => verifySkill(data),
    onSuccess: (data) => {
      setVerificationResult(data);
      setStep(4);
      if (onComplete) onComplete(data);
      toast({
        title: "Skill verification complete!",
        description: "Your skill has been successfully verified.",
      });
    },
    onError: (error) => {
      toast({
        title: "Verification failed",
        description: error instanceof Error ? error.message : "An error occurred during verification",
        variant: "destructive",
      });
    }
  });
  
  // Categories for selection
  const categories = [
    { value: "cooking", label: "Cooking & Baking" },
    { value: "crafts", label: "Crafts & Handmade" },
    { value: "tutoring", label: "Tutoring & Teaching" },
    { value: "beautywellness", label: "Beauty & Wellness" },
    { value: "homeservices", label: "Home Services" },
    { value: "general", label: "Other Skills" },
  ];
  
  // Handle category change
  const handleCategoryChange = (value: string) => {
    setCategory(value);
    form.setValue("category", value);
  };
  
  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    const filesArray = Array.from(files);
    
    // Check file types
    const invalidFiles = filesArray.filter(file => !isAllowedFileType(file));
    if (invalidFiles.length > 0) {
      toast({
        title: "Invalid file type",
        description: "Please upload only images, videos, or audio files.",
        variant: "destructive",
      });
      return;
    }
    
    setUploadedFiles(prev => [...prev, ...filesArray]);
    
    // Simulate upload for now
    setUploading(true);
    
    try {
      // Upload each file
      for (let i = 0; i < filesArray.length; i++) {
        const file = filesArray[i];
        setUploadProgress(Math.round((i / filesArray.length) * 100));
        
        // In a real implementation, we would upload the file to the server
        // and get back a URL to display
        const uploadedFile = await uploadFile(file, "skill_verification", skillId);
        
        setUploadedMedia(prev => [...prev, uploadedFile]);
      }
      
      setUploadProgress(100);
      toast({
        title: "Files uploaded successfully",
        description: `${filesArray.length} file(s) uploaded successfully.`,
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "An error occurred during upload",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };
  
  // Remove an uploaded file
  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  // Navigate to next step
  const nextStep = () => {
    if (step === 1) {
      // Validate step 1 fields
      const isValid = form.trigger(["name", "category"]);
      if (!isValid) return;
    }
    
    setStep(prev => Math.min(prev + 1, 4));
  };
  
  // Navigate to previous step
  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };
  
  // Handle form submission
  const onSubmit = (data: FormValues) => {
    if (step < 3) {
      nextStep();
      return;
    }
    
    // Extract answers for verification
    const answers: Record<string, string> = {};
    questions.forEach(question => {
      answers[question.id] = data[question.id as keyof FormValues] as string;
    });
    
    // Submit for verification
    verifySkillMutation.mutate({
      skillId: skillId,
      answers: answers
    });
  };
  
  // Get file icon based on type
  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) {
      return <ImageIcon className="h-6 w-6 text-blue-500" />;
    } else if (file.type.startsWith("video/")) {
      return <Video className="h-6 w-6 text-red-500" />;
    } else if (file.type.startsWith("audio/")) {
      return <Music className="h-6 w-6 text-green-500" />;
    } else {
      return <FileType className="h-6 w-6 text-gray-500" />;
    }
  };
  
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Skill Assessment</CardTitle>
        <CardDescription>
          Get your skills verified through our AI-powered assessment process
        </CardDescription>
        
        {/* Progress steps */}
        <div className="flex justify-between mt-6 mb-4">
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${step >= 1 ? "step-active" : "step-inactive"}`}>1</div>
            <span className="text-xs text-gray-600">Basic Info</span>
          </div>
          <div className="flex-1 h-0.5 bg-gray-200 self-center relative">
            <div className="absolute inset-0 bg-primary" style={{width: step > 1 ? '100%' : '0'}}></div>
          </div>
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${step >= 2 ? "step-active" : "step-inactive"}`}>2</div>
            <span className="text-xs text-gray-600">Upload</span>
          </div>
          <div className="flex-1 h-0.5 bg-gray-200 self-center relative">
            <div className="absolute inset-0 bg-primary" style={{width: step > 2 ? '100%' : '0'}}></div>
          </div>
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${step >= 3 ? "step-active" : "step-inactive"}`}>3</div>
            <span className="text-xs text-gray-600">Q&A</span>
          </div>
          <div className="flex-1 h-0.5 bg-gray-200 self-center relative">
            <div className="absolute inset-0 bg-primary" style={{width: step > 3 ? '100%' : '0'}}></div>
          </div>
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${step >= 4 ? "step-active" : "step-inactive"}`}>4</div>
            <span className="text-xs text-gray-600">Results</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Skill Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Cake Baking, Math Tutoring, etc." {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter the specific skill you want to get verified
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div>
                  <FormLabel>Skill Category</FormLabel>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    {categories.map((cat) => (
                      <div key={cat.value} className="flex items-center">
                        <input
                          type="radio"
                          id={cat.value}
                          name="category"
                          value={cat.value}
                          checked={category === cat.value}
                          onChange={() => handleCategoryChange(cat.value)}
                          className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                        />
                        <label htmlFor={cat.value} className="ml-2 block text-sm text-gray-700">
                          {cat.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 2: Upload Media */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Upload Media Samples</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Upload samples of your work to help our AI assess your skill level. You can upload images, videos, or audio files.
                  </p>
                  
                  <div className="space-y-4">
                    <label className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition cursor-pointer flex flex-col items-center justify-center">
                      <Upload className="h-10 w-10 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">Drag files here or click to browse</p>
                      <span className="text-xs text-gray-400 mt-1 block">
                        Images, videos, or audio files (max 100MB per file)
                      </span>
                      <input
                        type="file"
                        multiple
                        accept="image/*,video/*,audio/*"
                        className="hidden"
                        onChange={handleFileUpload}
                        disabled={uploading}
                      />
                    </label>
                    
                    {uploading && (
                      <div className="space-y-2">
                        <Progress value={uploadProgress} className="h-2 w-full" />
                        <p className="text-xs text-center text-gray-500">
                          Uploading... {uploadProgress}%
                        </p>
                      </div>
                    )}
                    
                    {uploadedFiles.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Uploaded Files</h4>
                        <ul className="space-y-2 max-h-60 overflow-y-auto">
                          {uploadedFiles.map((file, index) => (
                            <li key={index} className="flex items-center justify-between p-2 border rounded-md bg-gray-50">
                              <div className="flex items-center">
                                {getFileIcon(file)}
                                <span className="ml-2 text-sm truncate max-w-xs">{file.name}</span>
                                <span className="ml-2 text-xs text-gray-500">({formatFileSize(file.size)})</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeFile(index)}
                                className="text-red-500 hover:text-red-700"
                                disabled={uploading}
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 3: Q&A Assessment */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Skill-Specific Questions</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Please answer the following questions to help us assess your skill level.
                  </p>
                  
                  <div className="space-y-6">
                    {questions.map((question) => (
                      <FormField
                        key={question.id}
                        control={form.control}
                        name={question.id as any}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{question.question}</FormLabel>
                            <FormControl>
                              {question.type === "multiple_choice" && question.options ? (
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="flex flex-col space-y-1"
                                >
                                  {question.options.map((option) => (
                                    <div key={option} className="flex items-center space-x-2">
                                      <RadioGroupItem value={option} id={`${question.id}-${option}`} />
                                      <Label htmlFor={`${question.id}-${option}`}>{option}</Label>
                                    </div>
                                  ))}
                                </RadioGroup>
                              ) : (
                                <Textarea
                                  placeholder="Your answer"
                                  className="min-h-[100px]"
                                  {...field}
                                />
                              )}
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 4: Results */}
            {step === 4 && (
              <div className="space-y-6">
                {verificationResult ? (
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                        <Check className="h-12 w-12" />
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-center">Verification Complete!</h3>
                    
                    <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                      <div>
                        <p className="text-sm font-medium">Skill Level:</p>
                        <div className="flex items-center mt-1">
                          <div className="flex-1">
                            <Progress value={(verificationResult.skill.level / 5) * 100} className="h-2" />
                          </div>
                          <span className="ml-2 text-sm font-medium">Level {verificationResult.skill.level}/5</span>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium">Feedback:</p>
                        <p className="text-sm text-gray-600 mt-1">{verificationResult.verificationDetails.feedback}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="bg-white p-3 rounded-md shadow-sm">
                          <p className="text-xs text-gray-500">Skill Score</p>
                          <p className="text-lg font-semibold text-primary">{verificationResult.verificationDetails.score}%</p>
                        </div>
                        <div className="bg-white p-3 rounded-md shadow-sm">
                          <p className="text-xs text-gray-500">Verified On</p>
                          <p className="text-lg font-semibold text-gray-700">
                            {new Date(verificationResult.verificationDetails.verifiedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <Alert>
                      <AlertTitle>What's Next?</AlertTitle>
                      <AlertDescription>
                        Your skill verification badge is now visible on your profile. You can now create listings that showcase this verified skill.
                      </AlertDescription>
                    </Alert>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Skeleton className="h-24 w-24 rounded-full mx-auto" />
                    <Skeleton className="h-8 w-1/2 mx-auto" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  </div>
                )}
              </div>
            )}
          </form>
        </Form>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        {step > 1 && step < 4 && (
          <Button variant="outline" onClick={prevStep} disabled={verifySkillMutation.isPending}>
            Back
          </Button>
        )}
        
        {step < 4 ? (
          <Button 
            onClick={step === 3 ? form.handleSubmit(onSubmit) : nextStep}
            disabled={uploading || verifySkillMutation.isPending}
            className={step < 3 ? "ml-auto" : ""}
          >
            {step === 3 ? (
              verifySkillMutation.isPending ? "Verifying..." : "Submit for Verification"
            ) : (
              "Continue"
            )}
          </Button>
        ) : (
          <Button className="ml-auto" onClick={() => window.location.href = "/dashboard"}>
            Go to Dashboard
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default SkillAssessmentForm;
