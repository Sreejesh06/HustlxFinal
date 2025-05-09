import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogTitle, DialogDescription, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Listing } from "@/lib/types";

interface ListingFormProps {
  userId: number | undefined;
  initialData?: Partial<Listing>;
}

const listingSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  price: z.string().min(1, "Price is required"),
  image: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  tags: z.array(z.string()).optional(),
  status: z.enum(["draft", "active", "inactive"]),
});

export default function ListingForm({ userId, initialData }: ListingFormProps) {
  const { toast } = useToast();
  const isEditing = !!initialData?.id;
  
  const form = useForm<z.infer<typeof listingSchema>>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      price: initialData?.price || "",
      image: initialData?.image || "",
      category: initialData?.category || "",
      tags: initialData?.tags || [],
      status: initialData?.status || "draft",
    },
  });
  
  const tagInput = form.register("tags");
  
  const createListingMutation = useMutation({
    mutationFn: async (data: z.infer<typeof listingSchema>) => {
      if (!userId) throw new Error("User ID is required");
      
      const fullData = {
        ...data,
        userId,
      };
      
      const res = await apiRequest(
        isEditing ? "PATCH" : "POST", 
        isEditing ? `/api/listings/${initialData.id}` : "/api/listings", 
        fullData
      );
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/listings`] });
      toast({
        title: isEditing ? "Listing updated" : "Listing created",
        description: isEditing 
          ? "Your listing has been successfully updated." 
          : "Your listing has been successfully created.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? 'update' : 'create'} listing. Please try again.`,
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = (data: z.infer<typeof listingSchema>) => {
    createListingMutation.mutate(data);
  };
  
  const categories = [
    { value: "baking", label: "Baking & Culinary" },
    { value: "crafts", label: "Arts & Crafts" },
    { value: "services", label: "Home Services" },
    { value: "teaching", label: "Teaching & Workshops" },
    { value: "digital", label: "Digital Services" },
    { value: "events", label: "Events & Planning" }
  ];

  return (
    <>
      <DialogHeader>
        <DialogTitle>{isEditing ? "Edit Listing" : "Create New Listing"}</DialogTitle>
        <DialogDescription>
          {isEditing 
            ? "Update your listing details below." 
            : "Fill out the form below to create a new listing for your services or products."}
        </DialogDescription>
      </DialogHeader>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Listing Title</FormLabel>
                <FormControl>
                  <Input placeholder="Custom Celebration Cakes" {...field} />
                </FormControl>
                <FormDescription>
                  A clear, descriptive title helps customers find your listing
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
                    placeholder="Describe your service or product in detail. Include what makes it special, what's included, etc." 
                    className="min-h-32" 
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Detailed descriptions help customers understand what you're offering
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input placeholder="₹3,500-9,500 or ₹2,000/hour" {...field} />
                  </FormControl>
                  <FormDescription>
                    Set a fixed price or range
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
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
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/your-image.jpg" {...field} />
                </FormControl>
                <FormDescription>
                  Add a URL for an image that showcases your listing
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags (comma separated)</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Custom orders, Local delivery, Gluten-free" 
                    value={field.value?.join(", ") || ""} 
                    onChange={(e) => {
                      const tags = e.target.value.split(",").map(tag => tag.trim()).filter(Boolean);
                      field.onChange(tags);
                    }}
                  />
                </FormControl>
                <FormDescription>
                  Tags help customers find your listing when searching
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Draft: Save but don't publish. Active: Visible to customers. Inactive: Temporarily hidden.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <DialogFooter>
            <Button
              type="submit"
              className="bg-primary hover:bg-primary-dark text-white"
              disabled={createListingMutation.isPending}
            >
              {createListingMutation.isPending
                ? isEditing ? "Updating..." : "Creating..."
                : isEditing ? "Update Listing" : "Create Listing"
              }
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
}
