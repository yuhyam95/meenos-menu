import { sendOrderNotificationEmail, sendCustomerConfirmationEmail } from './email';
import { sendWhatsAppNotification, sendCustomerWhatsAppConfirmation, sendWhatsAppViaTwilio } from './whatsapp';
import type { Order } from './types';

interface NotificationConfig {
  adminEmail: string;
  adminPhone: string;
  enableEmail: boolean;
  enableWhatsApp: boolean;
  enableCustomerNotifications: boolean;
  customerEmail?: string;
  customerPhone?: string;
}

export async function sendOrderNotifications(order: Order, config: NotificationConfig) {
  const results = {
    email: { success: false, error: null as string | null },
    whatsapp: { success: false, error: null as string | null },
    customerEmail: { success: false, error: null as string | null },
    customerWhatsApp: { success: false, error: null as string | null }
  };

  // Send admin email notification
  if (config.enableEmail) {
    try {
      const emailResult = await sendOrderNotificationEmail(order, config.adminEmail);
      results.email = {
        success: emailResult.success,
        error: emailResult.success ? null : (emailResult.error as string || 'Unknown error')
      };
    } catch (error) {
      results.email = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Send admin WhatsApp notification
  if (config.enableWhatsApp) {
    try {
      // Try Twilio first, fallback to webhook
      let whatsappResult;
      if (process.env.TWILIO_ACCOUNT_SID) {
        whatsappResult = await sendWhatsAppViaTwilio(order, config.adminPhone);
      } else {
        whatsappResult = await sendWhatsAppNotification(order, config.adminPhone);
      }
      
      results.whatsapp = {
        success: whatsappResult.success,
        error: whatsappResult.success ? null : (whatsappResult.error as string || 'Unknown error')
      };
    } catch (error) {
      results.whatsapp = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Send customer email confirmation
  if (config.enableCustomerNotifications && config.customerEmail) {
    try {
      const customerEmailResult = await sendCustomerConfirmationEmail(order, config.customerEmail);
      results.customerEmail = {
        success: customerEmailResult.success,
        error: customerEmailResult.success ? null : (customerEmailResult.error as string || 'Unknown error')
      };
    } catch (error) {
      results.customerEmail = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Send customer WhatsApp confirmation
  if (config.enableCustomerNotifications && config.customerPhone) {
    try {
      let customerWhatsappResult;
      if (process.env.TWILIO_ACCOUNT_SID) {
        customerWhatsappResult = await sendWhatsAppViaTwilio(order, config.customerPhone);
      } else {
        customerWhatsappResult = await sendCustomerWhatsAppConfirmation(order, config.customerPhone);
      }
      
      results.customerWhatsApp = {
        success: customerWhatsappResult.success,
        error: customerWhatsappResult.success ? null : (customerWhatsappResult.error as string || 'Unknown error')
      };
    } catch (error) {
      results.customerWhatsApp = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  return results;
}

export function getNotificationConfig(): NotificationConfig {
  return {
    adminEmail: process.env.ADMIN_EMAIL || 'admin@meenos.com',
    adminPhone: process.env.ADMIN_PHONE || '+2348000000000',
    enableEmail: process.env.ENABLE_EMAIL_NOTIFICATIONS === 'true',
    enableWhatsApp: process.env.ENABLE_WHATSAPP_NOTIFICATIONS === 'true',
    enableCustomerNotifications: process.env.ENABLE_CUSTOMER_NOTIFICATIONS === 'true',
    customerEmail: process.env.CUSTOMER_EMAIL,
    customerPhone: process.env.CUSTOMER_PHONE
  };
}
