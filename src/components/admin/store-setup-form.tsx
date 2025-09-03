
"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { StoreSetting } from '@/lib/types';
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
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { getStoreSettings, saveStoreSettings } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const formSchema = z.object({
  accountName: z.string().optional(),
  accountNumber: z.string().optional(),
  bankName: z.string().optional(),
  headerImageUrl: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email({ message: "Please enter a valid email." }).optional().or(z.literal('')),
  facebookUrl: z.string().url().optional().or(z.literal('')),
  twitterUrl: z.string().url().optional().or(z.literal('')),
  instagramUrl: z.string().url().optional().or(z.literal('')),
});

export function StoreSetupForm() {
  const { toast } = useToast();
  const [initialData, setInitialData] = useState<StoreSetting | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accountName: '',
      accountNumber: '',
      bankName: '',
      headerImageUrl: '',
      address: '',
      phone: '',
      email: '',
      facebookUrl: '',
      twitterUrl: '',
      instagramUrl: '',
    },
  });

  useEffect(() => {
    async function fetchSettings() {
      const settings = await getStoreSettings();
      if (settings) {
        setInitialData(settings);
        form.reset({
          accountName: settings.accountName || '',
          accountNumber: settings.accountNumber || '',
          bankName: settings.bankName || '',
          headerImageUrl: settings.headerImageUrl || '',
          address: settings.address || '',
          phone: settings.phone || '',
          email: settings.email || '',
          facebookUrl: settings.facebookUrl || '',
          twitterUrl: settings.twitterUrl || '',
          instagramUrl: settings.instagramUrl || '',
        });
      }
    }
    fetchSettings();
  }, [form]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        form.setValue('headerImageUrl', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
        await saveStoreSettings(values);
        toast({
            title: 'Settings Saved',
            description: 'Your store settings have been updated successfully.',
        });
    } catch (error) {
        toast({
            title: 'Error',
            description: 'Failed to save settings. Please try again.',
            variant: 'destructive',
        });
    }
  }

  const headerImageUrlValue = form.watch('headerImageUrl');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
            <CardHeader>
                <CardTitle>Bank Account Details</CardTitle>
                <CardDescription>This information will be displayed to customers for payment.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <FormField
                    control={form.control}
                    name="bankName"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Bank Name</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., Guaranty Trust Bank" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="accountName"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Account Name</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="accountNumber"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Account Number</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., 0123456789" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>This will be displayed in your site's footer.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Store Address</FormLabel>
                        <FormControl>
                            <Input placeholder="123 Foodie Lane, Lekki, Lagos" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Public Phone Number</FormLabel>
                        <FormControl>
                            <Input placeholder="+234 801 234 5678" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Public Email Address</FormLabel>
                        <FormControl>
                            <Input placeholder="orders@meenos.ng" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Social Media</CardTitle>
                <CardDescription>Enter the full URLs for your social media profiles.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <FormField
                    control={form.control}
                    name="facebookUrl"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Facebook URL</FormLabel>
                        <FormControl>
                            <Input placeholder="https://facebook.com/meenos" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="twitterUrl"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Twitter / X URL</FormLabel>
                        <FormControl>
                            <Input placeholder="https://x.com/meenos" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="instagramUrl"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Instagram URL</FormLabel>
                        <FormControl>
                            <Input placeholder="https://instagram.com/meenos" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Store Visuals</CardTitle>
                <CardDescription>Manage images and branding for your storefront.</CardDescription>
            </CardHeader>
            <CardContent>
                <FormItem>
                    <FormLabel>Header Image</FormLabel>
                    {headerImageUrlValue && (
                        <div className="relative h-48 w-full my-2 rounded-md overflow-hidden">
                            <Image src={headerImageUrlValue} alt="Header Preview" fill className="object-cover" sizes="100vw"/>
                        </div>
                    )}
                    <FormControl>
                    <Input type="file" accept="image/*" onChange={handleImageChange} />
                    </FormControl>
                    <FormMessage>{form.formState.errors.headerImageUrl?.message}</FormMessage>
                </FormItem>
            </CardContent>
        </Card>
        
        <div className="flex justify-end gap-2 pt-4">
            <Button type="submit">Save Settings</Button>
        </div>
      </form>
    </Form>
  );
}
