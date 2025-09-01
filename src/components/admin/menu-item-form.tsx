
"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { FoodItem, FoodCategory } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
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
import Image from 'next/image';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  price: z.coerce.number().positive('Price must be a positive number.'),
  category: z.string().min(1, 'Category is required.'),
  imageUrl: z.string().min(1, 'Image is required.'),
});

interface MenuItemFormProps {
  item: FoodItem | null;
  categories: FoodCategory[];
  onSave: (data: Omit<FoodItem, 'id'> & { id?: string }) => void;
  onCancel: () => void;
}

export function MenuItemForm({ item, categories, onSave, onCancel }: MenuItemFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: item?.name || '',
      description: item?.description || '',
      price: item?.price || 0,
      category: item?.category || '',
      imageUrl: item?.imageUrl || '',
    },
  });

  useEffect(() => {
    form.reset({
        name: item?.name || '',
        description: item?.description || '',
        price: item?.price || 0,
        category: item?.category || '',
        imageUrl: item?.imageUrl || '',
    });
  }, [item, form]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        form.setValue('imageUrl', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    onSave({
      ...values,
      id: item?.id,
    });
  }

  const imageUrlValue = form.watch('imageUrl');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Jollof Rice" {...field} />
              </FormControl>
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
                <Textarea placeholder="Describe the item..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Price (NGN)</FormLabel>
                <FormControl>
                    <Input type="number" placeholder="3500" {...field} />
                </FormControl>
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {categories.map(category => (
                            <SelectItem key={category.id} value={category.name}>
                            {category.name}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
            />
        </div>
        <FormItem>
            <FormLabel>Image</FormLabel>
            {imageUrlValue && (
                <div className="relative h-40 w-full mb-2">
                    <Image src={imageUrlValue} alt="Preview" fill className="object-contain rounded-md" sizes="100vw"/>
                </div>
            )}
            <FormControl>
              <Input type="file" accept="image/*" onChange={handleImageChange} />
            </FormControl>
            <FormMessage>{form.formState.errors.imageUrl?.message}</FormMessage>
          </FormItem>

        <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
            <Button type="submit">Save Item</Button>
        </div>
      </form>
    </Form>
  );
}
