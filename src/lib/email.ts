import { Resend } from 'resend';
import type { Order } from './types';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOrderNotificationEmail(order: Order, adminEmail: string) {
  try {
    const orderItems = order.items.map(item => 
      `• ${item.name} x${item.quantity} - ₦${(item.price * item.quantity).toLocaleString()}`
    ).join('\n');

    const orderSummary = `
Order Details:
- Order ID: ${order.id}
- Customer: ${order.customer.name}
- Phone: ${order.customer.phone}
- Order Type: ${order.orderType}
- Status: ${order.status}
- Total: ₦${order.total.toLocaleString()}
- Created: ${order.createdAt.toLocaleString()}

Items:
${orderItems}

${order.customer.address ? `Delivery Address: ${order.customer.address}` : ''}
${order.notes ? `Notes: ${order.notes}` : ''}
    `.trim();

    const { data, error } = await resend.emails.send({
      from: 'Meenos Restaurant <noreply@meenos.com>',
      to: [adminEmail],
      subject: `New Order Received - ${order.id}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #d32f2f;">🍽️ New Order Received!</h2>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Order Details</h3>
            <p><strong>Order ID:</strong> ${order.id}</p>
            <p><strong>Customer:</strong> ${order.customer.name}</p>
            <p><strong>Phone:</strong> ${order.customer.phone}</p>
            <p><strong>Order Type:</strong> ${order.orderType}</p>
            <p><strong>Status:</strong> ${order.status}</p>
            <p><strong>Total:</strong> ₦${order.total.toLocaleString()}</p>
            <p><strong>Created:</strong> ${order.createdAt.toLocaleString()}</p>
            ${order.customer.address ? `<p><strong>Delivery Address:</strong> ${order.customer.address}</p>` : ''}
            ${order.notes ? `<p><strong>Notes:</strong> ${order.notes}</p>` : ''}
          </div>
          
          <div style="background: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <h3>Items Ordered</h3>
            <ul>
              ${order.items.map(item => 
                `<li>${item.name} x${item.quantity} - ₦${(item.price * item.quantity).toLocaleString()}</li>`
              ).join('')}
            </ul>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background: #e8f5e8; border-radius: 8px;">
            <p style="margin: 0; color: #2e7d32;"><strong>Action Required:</strong> Please check your admin panel to process this order.</p>
          </div>
        </div>
      `,
      text: orderSummary,
    });

    if (error) {
      console.error('Error sending email notification:', error);
      return { success: false, error };
    }

    console.log('Email notification sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error sending email notification:', error);
    return { success: false, error };
  }
}

export async function sendCustomerConfirmationEmail(order: Order, customerEmail?: string) {
  if (!customerEmail) return { success: false, error: 'No customer email provided' };

  try {
    const orderItems = order.items.map(item => 
      `• ${item.name} x${item.quantity} - ₦${(item.price * item.quantity).toLocaleString()}`
    ).join('\n');

    const { data, error } = await resend.emails.send({
      from: 'Meenos Restaurant <noreply@meenos.com>',
      to: [customerEmail],
      subject: `Order Confirmation - ${order.id}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #d32f2f;">🍽️ Thank you for your order!</h2>
          <p>Dear ${order.customer.name},</p>
          <p>We've received your order and will process it shortly. Here are the details:</p>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Order Details</h3>
            <p><strong>Order ID:</strong> ${order.id}</p>
            <p><strong>Order Type:</strong> ${order.orderType}</p>
            <p><strong>Total:</strong> ₦${order.total.toLocaleString()}</p>
            <p><strong>Status:</strong> ${order.status}</p>
            ${order.customer.address ? `<p><strong>Delivery Address:</strong> ${order.customer.address}</p>` : ''}
            ${order.notes ? `<p><strong>Notes:</strong> ${order.notes}</p>` : ''}
          </div>
          
          <div style="background: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <h3>Items Ordered</h3>
            <ul>
              ${order.items.map(item => 
                `<li>${item.name} x${item.quantity} - ₦${(item.price * item.quantity).toLocaleString()}</li>`
              ).join('')}
            </ul>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background: #e3f2fd; border-radius: 8px;">
            <p style="margin: 0; color: #1976d2;">We'll contact you soon to confirm your order. Thank you for choosing Meenos!</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Error sending customer confirmation email:', error);
      return { success: false, error };
    }

    console.log('Customer confirmation email sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error sending customer confirmation email:', error);
    return { success: false, error };
  }
}
