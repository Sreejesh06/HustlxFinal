import { useState } from "react";
import { Link } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye, 
  AlertTriangle, 
  CheckCircle2,
  XCircle,
  Package,
  Clock
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface Listing {
  id: number;
  title: string;
  price: number;
  type: 'service' | 'product';
  category: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
}

interface ListingManagerProps {
  listings: Listing[];
}

const ListingManager = ({ listings }: ListingManagerProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  
  // Format currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price / 100); // Price is stored in cents
  };
  
  // Status badges
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-none">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Active
          </Badge>
        );
      case 'inactive':
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-200 border-none">
            <XCircle className="h-3 w-3 mr-1" />
            Inactive
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-none">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  // Type badges
  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'service':
        return (
          <Badge variant="outline" className="font-normal bg-primary-light bg-opacity-20 text-primary-dark border-none">
            Service
          </Badge>
        );
      case 'product':
        return (
          <Badge variant="outline" className="font-normal bg-secondary-light bg-opacity-20 text-secondary-dark border-none">
            Product
          </Badge>
        );
      default:
        return <Badge>{type}</Badge>;
    }
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
  
  // Delete listing mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => {
      return apiRequest('DELETE', `/api/listings/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/homemakers'] });
      toast({
        title: 'Listing deleted',
        description: 'Your listing has been successfully deleted.',
      });
      setDeleteDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: 'Error deleting listing',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
  
  // Update listing status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: 'active' | 'inactive' | 'pending' }) => {
      return apiRequest('PATCH', `/api/listings/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/homemakers'] });
      toast({
        title: 'Listing updated',
        description: 'Your listing status has been updated.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error updating listing',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
  
  // Handle delete button click
  const handleDeleteClick = (listing: Listing) => {
    setSelectedListing(listing);
    setDeleteDialogOpen(true);
  };
  
  // Handle confirm delete
  const handleConfirmDelete = () => {
    if (selectedListing) {
      deleteMutation.mutate(selectedListing.id);
    }
  };
  
  // Handle status update
  const handleStatusUpdate = (id: number, status: 'active' | 'inactive' | 'pending') => {
    updateStatusMutation.mutate({ id, status });
  };
  
  return (
    <div>
      {listings.length === 0 ? (
        <div className="text-center py-10">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="text-lg font-medium">No listings yet</h3>
          <p className="text-muted-foreground mt-1 mb-4">
            Create your first listing to start selling your services or products
          </p>
          <Link href="/create-listing">
            <Button>Create Your First Listing</Button>
          </Link>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Listing</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {listings.map((listing) => (
                <TableRow key={listing.id}>
                  <TableCell className="font-medium max-w-[300px] truncate">
                    {listing.title}
                  </TableCell>
                  <TableCell>{getTypeBadge(listing.type)}</TableCell>
                  <TableCell>{formatPrice(listing.price)}</TableCell>
                  <TableCell>{getStatusBadge(listing.status)}</TableCell>
                  <TableCell>{formatDate(listing.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link href={`/listing/${listing.id}`}>
                            <div className="flex items-center cursor-pointer w-full">
                              <Eye className="mr-2 h-4 w-4" />
                              <span>View</span>
                            </div>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/edit-listing/${listing.id}`}>
                            <div className="flex items-center cursor-pointer w-full">
                              <Edit className="mr-2 h-4 w-4" />
                              <span>Edit</span>
                            </div>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {listing.status !== 'active' && (
                          <DropdownMenuItem onClick={() => handleStatusUpdate(listing.id, 'active')}>
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            <span>Set Active</span>
                          </DropdownMenuItem>
                        )}
                        {listing.status !== 'inactive' && (
                          <DropdownMenuItem onClick={() => handleStatusUpdate(listing.id, 'inactive')}>
                            <XCircle className="mr-2 h-4 w-4" />
                            <span>Set Inactive</span>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDeleteClick(listing)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Delete Listing
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <span className="font-medium">{selectedListing?.title}</span>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete Listing'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ListingManager;
