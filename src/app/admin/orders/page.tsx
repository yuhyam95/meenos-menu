
"use client";

import { useState, useEffect } from 'react';
import { getOrders, updateOrderStatus } from '@/app/actions';
import type { Order, OrderStatus } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from '@/components/ui/badge';
import { Truck, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

const statusColors: Record<OrderStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  Pending: 'destructive',
  'In Progress': 'secondary',
  Delivered: 'default',
  Cancelled: 'outline',
};

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchOrders() {
            setIsLoading(true);
            const fetchedOrders = await getOrders();
            setOrders(fetchedOrders);
            if (fetchedOrders.length > 0) {
                setSelectedOrder(fetchedOrders[0]);
            }
            setIsLoading(false);
        }
        fetchOrders();
    }, []);
    
    const handleSelectOrder = (order: Order) => {
        setSelectedOrder(order);
    };

    const handleStatusUpdate = async (orderId: string, status: OrderStatus) => {
      await updateOrderStatus(orderId, status);
      const updatedOrders = await getOrders();
      setOrders(updatedOrders);
      if (selectedOrder?.id === orderId) {
        const updatedSelected = updatedOrders.find(o => o.id === orderId);
        setSelectedOrder(updatedSelected || null);
      }
    };


    return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="font-headline text-4xl font-bold tracking-tight">
          Incoming Orders
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          View and manage customer orders.
        </p>
      </header>

      <div className="grid gap-8 md:grid-cols-3 lg:grid-cols-4 h-[calc(100vh-12rem)]">
        <div className="md:col-span-1 lg:col-span-1 h-full">
            <Card className="h-full flex flex-col">
                <CardHeader>
                    <CardTitle>Orders</CardTitle>
                    <CardDescription>Select an order to view details</CardDescription>
                </CardHeader>
                <CardContent className="p-0 flex-1 overflow-y-auto">
                    <div className="flex flex-col">
                    {isLoading ? (
                      <p className="p-4 text-center">Loading orders...</p>
                    ) : orders.length === 0 ? (
                      <p className="p-4 text-center">No orders found.</p>
                    ) : (
                      orders.map((order) => (
                        <button
                        key={order.id}
                        onClick={() => handleSelectOrder(order)}
                        className={`w-full text-left p-4 border-b last:border-b-0 hover:bg-accent ${selectedOrder?.id === order.id ? 'bg-accent' : ''}`}
                        >
                        <div className="flex justify-between items-center">
                            <p className="font-semibold">{order.customer.name}</p>
                            <Badge variant={statusColors[order.status]}>
                                {order.status}
                            </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{format(new Date(order.createdAt), "PPp")}</p>
                        </button>
                      ))
                    )}
                    </div>
                </CardContent>
            </Card>
        </div>

        <div className="md:col-span-2 lg:col-span-3 h-full">
          {selectedOrder ? (
            <Card className="h-full overflow-y-auto">
              <CardHeader className="flex flex-row items-center justify-between sticky top-0 bg-card z-10">
                <div>
                  <CardTitle>Order Details</CardTitle>
                  <CardDescription>Order ID: {selectedOrder.id}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={statusColors[selectedOrder.status]} className="capitalize">
                    {selectedOrder.status}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {(Object.keys(statusColors) as OrderStatus[]).map((status) => (
                        <DropdownMenuItem
                          key={status}
                          onClick={() => handleStatusUpdate(selectedOrder.id, status)}
                          disabled={selectedOrder.status === status}
                        >
                          Mark as {status}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                    <div>
                        <h3 className="font-semibold mb-2">Customer Information</h3>
                        <p><strong>Name:</strong> {selectedOrder.customer.name}</p>
                        <p><strong>Phone:</strong> {selectedOrder.customer.phone}</p>
                        {selectedOrder.customer.address && <p><strong>Address:</strong> {selectedOrder.customer.address}</p>}
                        <p className="text-sm text-muted-foreground mt-1">
                          Ordered on: {format(new Date(selectedOrder.createdAt), "PPpp")}
                        </p>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2">Order Items</h3>
                        <Table>
                            <TableHeader>
                            <TableRow>
                                <TableHead>Item</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead className="text-right">Price</TableHead>
                            </TableRow>
                            </TableHeader>
                            <TableBody>
                            {selectedOrder.items.map((item) => (
                                <TableRow key={item.id}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{item.quantity}</TableCell>
                                <TableCell className="text-right">
                                    {(item.price * item.quantity).toLocaleString('en-NG', { style: 'currency', currency: 'NGN' })}
                                </TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                    </div>
                    <div className="flex justify-end items-center font-bold text-xl">
                        <span className="mr-4">Total:</span>
                        <span>{selectedOrder.total.toLocaleString('en-NG', { style: 'currency', currency: 'NGN' })}</span>
                    </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-20 rounded-lg bg-card border border-dashed h-full">
                <Truck className="w-16 h-16 text-muted-foreground mb-4" />
                <h2 className="text-2xl font-semibold text-foreground">Select an Order</h2>
                <p className="text-muted-foreground mt-2">Choose an order from the list to see its details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
