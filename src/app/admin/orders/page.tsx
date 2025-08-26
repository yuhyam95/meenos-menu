
"use client";

import { useState } from 'react';
import { orders as initialOrders } from '@/lib/data';
import type { Order } from '@/lib/types';
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
import { Truck } from 'lucide-react';


export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>(initialOrders);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(orders[0] || null);


    const handleSelectOrder = (order: Order) => {
        setSelectedOrder(order);
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

      <div className="grid gap-8 md:grid-cols-3 lg:grid-cols-4">
        <div className="md:col-span-1 lg:col-span-1">
            <Card className="h-full">
                <CardHeader>
                    <CardTitle>Orders</CardTitle>
                    <CardDescription>Select an order to view details</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="flex flex-col">
                    {orders.map((order) => (
                        <button
                        key={order.id}
                        onClick={() => handleSelectOrder(order)}
                        className={`w-full text-left p-4 border-b last:border-b-0 hover:bg-accent ${selectedOrder?.id === order.id ? 'bg-accent' : ''}`}
                        >
                        <div className="flex justify-between items-center">
                            <p className="font-semibold">{order.customer.name}</p>
                            <Badge variant={order.status === 'Delivered' ? 'default' : order.status === 'Pending' ? 'destructive' : 'secondary'}>
                                {order.status}
                            </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{order.id}</p>
                        </button>
                    ))}
                    </div>
                </CardContent>
            </Card>
        </div>

        <div className="md:col-span-2 lg:col-span-3">
          {selectedOrder ? (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Order Details</CardTitle>
                  <CardDescription>Order ID: {selectedOrder.id}</CardDescription>
                </div>
                <Badge variant={selectedOrder.status === 'Delivered' ? 'default' : selectedOrder.status === 'Pending' ? 'destructive' : 'secondary'} className="capitalize">
                  {selectedOrder.status}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                    <div>
                        <h3 className="font-semibold mb-2">Customer Information</h3>
                        <p><strong>Name:</strong> {selectedOrder.customer.name}</p>
                        <p><strong>Phone:</strong> {selectedOrder.customer.phone}</p>
                        {selectedOrder.customer.address && <p><strong>Address:</strong> {selectedOrder.customer.address}</p>}
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
