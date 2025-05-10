import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/lib/auth";
import { uploadFile, isAllowedFileType, formatFileSize } from "@/lib/uploadHelpers";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { AlertCircle, Info, Upload, Plus, X, Check, DollarSign } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Form schema with Zod
const createListingSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100, "Title cannot exceed 100 characters"),
  description: z.string().min(20, "Description must be at least 20 characters").max(1000, "Description cannot exceed 1000 characters"),
  price: z.coerce.number().min(1, "Price must be at least 1").max(10000, "Price cannot exceed 10000"),
  category: z.string().min(1, "Please select a category"),
  type: z.enum(["service", "product"]),
  tags: z.string().optional(),
  location: z.string().optional(),
  availability: z.string().optional(),
  isHighlighted: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  deliveryTimeInDays: z.coerce.number().min(1).max(60).optional(),
  quantity: z.coerce.number().min(1).max(1000).optional(),
});

type CreateListingFormValues = z.infer<typeof createListingSchema>;

const CATEGORY_OPTIONS = [
  "Cooking & Baking",
  "Sewing & Tailoring",
  "Arts & Crafts",
  "Gardening",
  "Childcare",
  "Education & Tutoring",
  "Home Organization",
  "Beauty & Wellness",
  "Interior Design",
  "Digital Services",
  "Handmade Products",
  "Event Planning",
  "Financial Management",
  "Other"
];

export default function CreateListing() {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [listingType, setListingType] = useState<"service" | "product">("service");
  
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuth();
  
  // Redirect if user is not authenticated or not a homemaker
  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to create a listing",
        variant: "destructive",
      });
      setLocation("/");
      return;
    }
    
    if (user?.role !== "homemaker") {
      toast({
        title: "Access denied",
        description: "Only homemakers can create listings",
        variant: "destructive",
      });
      setLocation("/");
    }
  }, [isAuthenticated, user, setLocation, toast]);
  
  const form = useForm<CreateListingFormValues>({
    resolver: zodResolver(createListingSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      category: "",
      type: "service",
      tags: "",
      location: "",
      availability: "",
      isHighlighted: false,
      isFeatured: false,
      deliveryTimeInDays: 7,
      quantity: 1,
    },
  });
  
  const createListingMutation = useMutation({
    mutationFn: async (data: CreateListingFormValues) => {
      // First, create the listing
      const response = await apiRequest("/api/listings", {
        method: "POST",
        body: JSON.stringify(data),
      });
      
      // If files were uploaded, associate them with the listing
      if (uploadedFiles.length > 0 && response.id) {
        const uploadPromises = uploadedFiles.map(file => 
          uploadFile(file, "listing", response.id)
        );
        await Promise.all(uploadPromises);
      }
      
      return response;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/listings"] });
      toast({
        title: "Listing created successfully",
        description: "Your listing is now live in the marketplace",
      });
      navigate(`/listing/${data.id}`);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create listing",
        description: error.message || "An error occurred while creating your listing",
        variant: "destructive",
      });
    }
  });
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    // Validate files
    const newFiles: File[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!isAllowedFileType(file)) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not a valid file type. Please upload images, videos, or audio files.`,
          variant: "destructive",
        });
        continue;
      }
      
      if (file.size > 10 * 1024 * 1024) { // 10MB max
        toast({
          title: "File too large",
          description: `${file.name} exceeds the maximum file size of 10MB.`,
          variant: "destructive",
        });
        continue;
      }
      
      newFiles.push(file);
    }
    
    if (newFiles.length > 0) {
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
    
    // Reset the input
    e.target.value = "";
  };
  
  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  const onSubmit = async (data: CreateListingFormValues) => {
    // Process tags if any
    if (data.tags) {
      data.tags = data.tags
        .split(",")
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)
        .join(",");
    }
    
    createListingMutation.mutate(data);
  };

  // Handle tab change
  const handleTabChange = (value: string) => {
    if (value === "service" || value === "product") {
      setListingType(value);
      form.setValue("type", value);
    }
  };
  
  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-heading font-bold tracking-tight">Create a New Listing</h1>
          <p className="text-muted-foreground mt-2">
            Share your skills and products with potential customers.
          </p>
        </div>
        
        <Tabs value={listingType} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="service">Service</TabsTrigger>
            <TabsTrigger value="product">Product</TabsTrigger>
          </TabsList>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>
                    Provide the essential details about your {listingType}.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder={`Enter ${listingType} title`} {...field} />
                        </FormControl>
                        <FormDescription>
                          Create a clear and appealing title that describes your offering.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder={`Describe your ${listingType} in detail`} 
                            className="min-h-32" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Explain what you offer, your experience, and any special features.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {CATEGORY_OPTIONS.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                              <Input 
                                type="number" 
                                placeholder="0.00" 
                                className="pl-10" 
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormDescription>
                            {listingType === "service" 
                              ? "Price per hour or per project" 
                              : "Price per item"}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tags</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g. homemade, organic, vegan (comma separated)" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Add relevant tags to help customers find your listing.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              
              <TabsContent value="service" className="space-y-6 mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Service Details</CardTitle>
                    <CardDescription>
                      Provide additional information specific to your service.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g. Remote, Your home, Client's location" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Where will you provide this service?
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="availability"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Availability</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g. Weekdays 9-5, Weekends only" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            When are you available to provide this service?
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="deliveryTimeInDays"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estimated Completion Time (days)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min={1}
                              max={60}
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            How long will it typically take to complete this service?
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="product" className="space-y-6 mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Product Details</CardTitle>
                    <CardDescription>
                      Provide additional information specific to your product.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Available Quantity</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min={1}
                              max={1000}
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            How many items do you have available for sale?
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="deliveryTimeInDays"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Shipping Time (days)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min={1}
                              max={30}
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            How long will it take to ship this product?
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <Card>
                <CardHeader>
                  <CardTitle>Media</CardTitle>
                  <CardDescription>
                    Upload photos, videos, or audio files to showcase your {listingType}.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="file-upload" className="block mb-2">Upload Files</Label>
                      <div className="flex items-center gap-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById("file-upload")?.click()}
                          className="w-full"
                        >
                          <Upload className="mr-2 h-4 w-4" /> Select Files
                        </Button>
                        <Input
                          id="file-upload"
                          type="file"
                          multiple
                          className="hidden"
                          onChange={handleFileUpload}
                          accept="image/*,video/*,audio/*"
                        />
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Max 10MB per file. Supported formats: images, videos, audio.
                      </p>
                    </div>
                    
                    <div>
                      <Label className="block mb-2">Priority Listing</Label>
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="isHighlighted"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                              <div className="space-y-0.5">
                                <FormLabel>Highlight Listing</FormLabel>
                                <FormDescription>
                                  Make your listing stand out with special styling
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="isFeatured"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                              <div className="space-y-0.5">
                                <FormLabel>Feature on Homepage</FormLabel>
                                <FormDescription>
                                  Show your listing in the featured section
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {uploadedFiles.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Selected Files ({uploadedFiles.length})</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {uploadedFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                            <div className="flex items-center space-x-2 truncate">
                              {file.type.startsWith("image/") ? (
                                <img
                                  src={URL.createObjectURL(file)}
                                  alt="Preview"
                                  className="w-10 h-10 object-cover rounded"
                                />
                              ) : (
                                <div className="w-10 h-10 bg-muted flex items-center justify-center rounded">
                                  {file.type.startsWith("video/") ? "🎬" : "🔊"}
                                </div>
                              )}
                              <span className="text-sm truncate max-w-[120px]">{file.name}</span>
                            </div>
                            <div className="flex items-center">
                              <span className="text-xs text-muted-foreground mr-2">
                                {formatFileSize(file.size)}
                              </span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeFile(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/dashboard")}
                  disabled={createListingMutation.isPending}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={createListingMutation.isPending}
                >
                  {createListingMutation.isPending ? (
                    <>Creating Listing...</>
                  ) : (
                    <>Create Listing</>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </Tabs>
      </div>
    </div>
  );
}