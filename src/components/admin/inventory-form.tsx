"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { InventoryItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useEffect } from 'react';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  unit: z.string().min(1, 'Unit is required.'),
  quantity: z.number().min(0, 'Quantity must be 0 or greater.'),
  minQuantity: z.number().min(0, 'Minimum quantity must be 0 or greater.').optional().or(z.literal('')),
  description: z.string().optional(),
});

interface InventoryFormProps {
  item: InventoryItem | null;
  onSave: (item: Omit<InventoryItem, 'id'> & { id?: string }) => void;
  onCancel: () => void;
}

const commonUnits = ['kg', 'g', 'liters', 'ml', 'pieces', 'boxes', 'bags', 'bottles', 'cans', 'packets'];

export function InventoryForm({ item, onSave, onCancel }: InventoryFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: item?.name || '',
      unit: item?.unit || '',
      quantity: item?.quantity ?? 0,
      minQuantity: item?.minQuantity ?? undefined,
      description: item?.description || '',
    },
  });

  useEffect(() => {
    form.reset({
      name: item?.name || '',
      unit: item?.unit || '',
      quantity: item?.quantity ?? 0,
      minQuantity: item?.minQuantity ?? undefined,
      description: item?.description || '',
    });
  }, [item, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    onSave({
      name: values.name,
      unit: values.unit,
      quantity: values.quantity,
      minQuantity: values.minQuantity === '' ? undefined : values.minQuantity,
      description: values.description || undefined,
      id: item?.id,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Material Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Flour, Sugar, Cooking Oil" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="unit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Unit</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a unit" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {commonUnits.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                The unit of measurement for this material
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Quantity</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="minQuantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Minimum Quantity (Optional)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0"
                  {...field}
                  value={field.value ?? ''}
                  onChange={(e) => field.onChange(e.target.value === '' ? '' : parseFloat(e.target.value) || 0)}
                />
              </FormControl>
              <FormDescription>
                Alert threshold when stock is low
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
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Additional notes about this material..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
            <Button type="submit">{item ? 'Update Item' : 'Add Item'}</Button>
        </div>
      </form>
    </Form>
  );
}

