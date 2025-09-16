'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { TestTube } from 'lucide-react';

export function NotificationSettings() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleTestNotifications = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/test-notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: 'Test Notifications Sent!',
          description: `Email: ${data.results.email}, WhatsApp: ${data.results.whatsapp}`,
        });
      } else {
        toast({
          title: 'Test Failed',
          description: data.error || 'Failed to send test notifications',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send test notifications',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            Notification Testing
          </CardTitle>
          <CardDescription>
            Test your email and WhatsApp notification setup
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Send Test Notifications</p>
              <p className="text-sm text-muted-foreground">
                This will send test notifications to your configured email and WhatsApp
              </p>
            </div>
            <Button 
              onClick={handleTestNotifications} 
              disabled={isLoading}
              variant="outline"
            >
              {isLoading ? 'Sending...' : 'Send Test'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Configuration Guide</CardTitle>
          <CardDescription>
            Set up your notification services using environment variables
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Email Setup (Resend) - REQUIRED</Label>
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-blue-600 font-semibold">✓ Email Notifications (Recommended)</span>
                </div>
                <ul className="ml-4 mt-1 space-y-1 text-blue-700">
                  <li>• RESEND_API_KEY</li>
                  <li>• ADMIN_EMAIL</li>
                  <li>• ENABLE_EMAIL_NOTIFICATIONS=true</li>
                </ul>
                <p className="text-xs text-blue-600 mt-2">
                  Uses <code className="bg-blue-100 px-1 py-0.5 rounded">onboarding@resend.dev</code> (verified domain)
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">WhatsApp Setup (Optional)</Label>
              <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 font-semibold">📱 WhatsApp (Optional)</span>
                </div>
                <ul className="ml-4 mt-1 space-y-1 text-gray-600">
                  <li>• WHATSAPP_FREE_WEBHOOK_URL (CallMeBot)</li>
                  <li>• ADMIN_PHONE</li>
                  <li>• ENABLE_WHATSAPP_NOTIFICATIONS=true</li>
                </ul>
                <p className="text-xs text-gray-500 mt-2">
                  See <code className="bg-gray-100 px-1 py-0.5 rounded">WHATSAPP_FREE_SETUP.md</code> for setup
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Paid WhatsApp Options (Optional)</Label>
              <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
                <div>
                  <strong>Twilio WhatsApp:</strong>
                  <ul className="ml-4 mt-1 space-y-1">
                    <li>• TWILIO_ACCOUNT_SID</li>
                    <li>• TWILIO_AUTH_TOKEN</li>
                    <li>• TWILIO_WHATSAPP_NUMBER</li>
                    <li>• ADMIN_PHONE</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground">
            <p>
              See <code className="bg-muted px-1 py-0.5 rounded">NOTIFICATION_SETUP.md</code> for detailed setup instructions.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
