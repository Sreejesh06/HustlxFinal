import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  MoreVertical, 
  CheckCircle2,
  XCircle,
  Eye,
  Clock,
  ShoppingBag,
  AlertTriangle
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
import { useAuth } from "@/lib/auth";

interface Order {
  id: number;
  listingId: number;
  customerId: number;
  homemakerId: number;
  status: 'pending' | 'paid' | 'completed' | 'canceled';
  quantity: number;
  totalAmount: number;
  deliveryDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  listing?: {
    title: string;
    type: 'service' | 'product';
  };
}

interface OrdersTableProps {
  orders: Order[];
  compact?: boolean;
  isCustomer?: boolean;
}

const OrdersTable = ({ orders, compact = false, isCustomer = false }: OrdersTableProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [actionType, setActionType] = useState<'complete' | 'cancel' | null>(null);
  
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
      case 'pending':
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-none">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case 'paid':
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-none">
            <ShoppingBag className="h-3 w-3 mr-1" />
            Paid
          </Badge>
        );
      case 'completed':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-none">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        );
      case 'canceled':
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-200 border-none">
            <XCircle className="h-3 w-3 mr-1" />
            Canceled
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
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
  
  // Update order status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: Order['status'] }) => {
      return apiRequest('PATCH', `/api/orders/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/orders/me'] });
      toast({
        title: `Order ${actionType === 'complete' ? 'completed' : 'canceled'}`,
        description: `The order has been ${actionType === 'complete' ? 'marked as completed' : 'canceled'}.`,
      });
      setConfirmDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: `Error ${actionType === 'complete' ? 'completing' : 'canceling'} order`,
        description: error.message,
        variant: 'destructive',
      });
    },
  });
  
  // Handle action button click
  const handleActionClick = (order: Order, action: 'complete' | 'cancel') => {
    setSelectedOrder(order);
    setActionType(action);
    setConfirmDialogOpen(true);
  };
  
  // Handle confirm action
  const handleConfirmAction = () => {
    if (selectedOrder && actionType) {
      const status = actionType === 'complete' ? 'completed' : 'canceled';
      updateStatusMutation.mutate({ id: selectedOrder.id, status });
    }
  };
  
  // Get compact view columns
  const getCompactColumns = () => {
    return (
      <>
        <TableHead>Order</TableHead>
        <TableHead>Amount</TableHead>
        <TableHead>Date</TableHead>
        <TableHead>Status</TableHead>
      </>
    );
  };
  
  // Get full view columns
  const getFullColumns = () => {
    return (
      <>
        <TableHead>Order ID</TableHead>
        <TableHead className="w-[250px]">Service/Product</TableHead>
        <TableHead>{isCustomer ? 'Homemaker' : 'Customer'}</TableHead>
        <TableHead>Amount</TableHead>
        <TableHead>Date</TableHead>
        <TableHead>Status</TableHead>
        <TableHead className="text-right">Actions</TableHead>
      </>
    );
  };
  
  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {compact ? getCompactColumns() : getFullColumns()}
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={compact ? 4 : 7} className="text-center py-8 text-muted-foreground">
                  No orders found
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id}>
                  {!compact && <TableCell>#{order.id}</TableCell>}
                  <TableCell className={`font-medium ${compact ? '' : 'max-w-[250px] truncate'}`}>
                    {compact ? `Order #${order.id}` : (order.listing?.title || `Order #${order.id}`)}
                  </TableCell>
                  {!compact && (
                    <TableCell>
                      {isCustomer ? `Homemaker ID: ${order.homemakerId}` : `Customer ID: ${order.customerId}`}
                    </TableCell>
                  )}
                  <TableCell>{formatPrice(order.totalAmount)}</TableCell>
                  <TableCell>{formatDate(order.createdAt)}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  {!compact && (
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
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            <span>View Details</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {/* Homemaker can complete orders */}
                          {!isCustomer && order.status === 'paid' && (
                            <DropdownMenuItem onClick={() => handleActionClick(order, 'complete')}>
                              <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" />
                              <span>Mark as Completed</span>
                            </DropdownMenuItem>
                          )}
                          {/* Customer can cancel orders */}
                          {isCustomer && (order.status === 'pending' || order.status === 'paid') && (
                            <DropdownMenuItem onClick={() => handleActionClick(order, 'cancel')}>
                              <XCircle className="mr-2 h-4 w-4 text-red-600" />
                              <span>Cancel Order</span>
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {actionType === 'complete' ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  Complete Order
                </>
              ) : (
                <>
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  Cancel Order
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {actionType === 'complete'
                ? `Are you sure you want to mark order #${selectedOrder?.id} as completed?`
                : `Are you sure you want to cancel order #${selectedOrder?.id}? This action cannot be undone.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmDialogOpen(false)}
              disabled={updateStatusMutation.isPending}
            >
              No, go back
            </Button>
            <Button
              variant={actionType === 'complete' ? 'default' : 'destructive'}
              onClick={handleConfirmAction}
              disabled={updateStatusMutation.isPending}
            >
              {updateStatusMutation.isPending
                ? 'Processing...'
                : actionType === 'complete'
                ? 'Yes, complete order'
                : 'Yes, cancel order'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrdersTable;
