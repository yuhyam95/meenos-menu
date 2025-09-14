import axios from 'axios';
import type { Order } from './types';

interface WhatsAppMessage {
  to: string;
  message: string;
}

export async function sendWhatsAppNotification(order: Order, adminPhone: string) {
  try {
    const orderItems = order.items.map(item => 
      `• ${item.name} x${item.quantity} - ₦${(item.price * item.quantity).toLocaleString()}`
    ).join('\n');

    const message = `🍽️ *NEW ORDER RECEIVED!*

*Order ID:* ${order.id}
*Customer:* ${order.customer.name}
*Phone:* ${order.customer.phone}
*Order Type:* ${order.orderType}
*Status:* ${order.status}
*Total:* ₦${order.total.toLocaleString()}
*Time:* ${order.createdAt.toLocaleString()}

*Items:*
${orderItems}

${order.customer.address ? `*Delivery Address:* ${order.customer.address}` : ''}
${order.notes ? `*Notes:* ${order.notes}` : ''}

Please check your admin panel to process this order.`;

    // Using WhatsApp Business API or a service like Twilio
    // For now, we'll use a webhook approach that can be configured
    const webhookUrl = process.env.WHATSAPP_WEBHOOK_URL;
    
    if (!webhookUrl) {
      console.warn('WhatsApp webhook URL not configured. Skipping WhatsApp notification.');
      return { success: false, error: 'WhatsApp webhook URL not configured' };
    }

    const payload: WhatsAppMessage = {
      to: adminPhone,
      message: message
    };

    const response = await axios.post(webhookUrl, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.WHATSAPP_API_TOKEN || ''}`
      },
      timeout: 10000
    });

    if (response.status === 200) {
      console.log('WhatsApp notification sent successfully');
      return { success: true, data: response.data };
    } else {
      console.error('WhatsApp notification failed:', response.status, response.data);
      return { success: false, error: `HTTP ${response.status}` };
    }
  } catch (error) {
    console.error('Error sending WhatsApp notification:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function sendCustomerWhatsAppConfirmation(order: Order, customerPhone: string) {
  try {
    const message = `🍽️ *Thank you for your order!*

Dear ${order.customer.name},

We've received your order and will process it shortly.

*Order ID:* ${order.id}
*Order Type:* ${order.orderType}
*Total:* ₦${order.total.toLocaleString()}
*Status:* ${order.status}

${order.customer.address ? `*Delivery Address:* ${order.customer.address}` : ''}
${order.notes ? `*Notes:* ${order.notes}` : ''}

We'll contact you soon to confirm your order. Thank you for choosing Meenos! 🍽️`;

    const webhookUrl = process.env.WHATSAPP_WEBHOOK_URL;
    
    if (!webhookUrl) {
      console.warn('WhatsApp webhook URL not configured. Skipping customer WhatsApp notification.');
      return { success: false, error: 'WhatsApp webhook URL not configured' };
    }

    const payload: WhatsAppMessage = {
      to: customerPhone,
      message: message
    };

    const response = await axios.post(webhookUrl, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.WHATSAPP_API_TOKEN || ''}`
      },
      timeout: 10000
    });

    if (response.status === 200) {
      console.log('Customer WhatsApp confirmation sent successfully');
      return { success: true, data: response.data };
    } else {
      console.error('Customer WhatsApp confirmation failed:', response.status, response.data);
      return { success: false, error: `HTTP ${response.status}` };
    }
  } catch (error) {
    console.error('Error sending customer WhatsApp confirmation:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Alternative: Using a service like Twilio WhatsApp API
export async function sendWhatsAppViaTwilio(order: Order, adminPhone: string) {
  try {
    const orderItems = order.items.map(item => 
      `• ${item.name} x${item.quantity} - ₦${(item.price * item.quantity).toLocaleString()}`
    ).join('\n');

    const message = `🍽️ *NEW ORDER RECEIVED!*

*Order ID:* ${order.id}
*Customer:* ${order.customer.name}
*Phone:* ${order.customer.phone}
*Order Type:* ${order.orderType}
*Status:* ${order.status}
*Total:* ₦${order.total.toLocaleString()}
*Time:* ${order.createdAt.toLocaleString()}

*Items:*
${orderItems}

${order.customer.address ? `*Delivery Address:* ${order.customer.address}` : ''}
${order.notes ? `*Notes:* ${order.notes}` : ''}

Please check your admin panel to process this order.`;

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER;

    if (!accountSid || !authToken || !fromNumber) {
      console.warn('Twilio credentials not configured. Skipping WhatsApp notification.');
      return { success: false, error: 'Twilio credentials not configured' };
    }

    const response = await axios.post(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      new URLSearchParams({
        From: `whatsapp:${fromNumber}`,
        To: `whatsapp:${adminPhone}`,
        Body: message
      }),
      {
        auth: {
          username: accountSid,
          password: authToken
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    if (response.status === 201) {
      console.log('WhatsApp notification sent via Twilio successfully');
      return { success: true, data: response.data };
    } else {
      console.error('WhatsApp notification via Twilio failed:', response.status, response.data);
      return { success: false, error: `HTTP ${response.status}` };
    }
  } catch (error) {
    console.error('Error sending WhatsApp notification via Twilio:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
