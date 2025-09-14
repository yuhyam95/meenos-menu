import { NotificationSettings } from '@/components/admin/notification-settings';

export default function NotificationsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Notification Settings</h1>
        <p className="text-muted-foreground mt-2">
          Configure and test your email and WhatsApp notifications
        </p>
      </div>
      
      <NotificationSettings />
    </div>
  );
}
