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
      from: 'Meenos Restaurant <noreply@meenos.ng>',
      to: [adminEmail],
      subject: `New Order Received - ${order.id}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
          <!-- Header with Logo -->
          <div style="background: linear-gradient(135deg,rgb(225, 167, 167) 0%,rgb(214, 124, 124) 100%); padding: 30px 20px; text-align: center; border-radius: 12px 12px 0 0;">
            <img src="https://meenos.ng/meenos-logo.png" alt="Meenos Restaurant" style="height: 60px; margin-bottom: 15px;" />
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">🍽️ New Order Received!</h1>
            </div>
          
          <!-- Order Details Card -->
          <div style="background: #f8f9fa; padding: 25px; margin: 0; border-left: 4px solid #d32f2f;">
            <h2 style="color: #2c3e50; margin: 0 0 20px 0; font-size: 22px; font-weight: 600;">📋 Order Information</h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
              <div style="background: #ffffff; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <p style="margin: 0 0 8px 0; color: #6c757d; font-size: 14px; font-weight: 500;">CUSTOMER</p>
                <p style="margin: 0; color: #2c3e50; font-size: 16px; font-weight: 600;">${order.customer.name}</p>
              </div>
              <div style="background: #ffffff; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <p style="margin: 0 0 8px 0; color: #6c757d; font-size: 14px; font-weight: 500;">PHONE</p>
                <p style="margin: 0; color: #2c3e50; font-size: 16px; font-weight: 600;">${order.customer.phone}</p>
              </div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
              <div style="background: #ffffff; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <p style="margin: 0 0 8px 0; color: #6c757d; font-size: 14px; font-weight: 500;">ORDER TYPE</p>
                <p style="margin: 0; color: #2c3e50; font-size: 16px; font-weight: 600; text-transform: capitalize;">${order.orderType}</p>
              </div>
              <div style="background: #ffffff; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <p style="margin: 0 0 8px 0; color: #6c757d; font-size: 14px; font-weight: 500;">STATUS</p>
                <p style="margin: 0; color: #d32f2f; font-size: 16px; font-weight: 600; text-transform: uppercase;">${order.status}</p>
              </div>
            </div>
            <div style="background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); text-align: center;">
              <p style="margin: 0 0 8px 0; color: #6c757d; font-size: 14px; font-weight: 500;">TOTAL AMOUNT</p>
              <p style="margin: 0; color: #d32f2f; font-size: 28px; font-weight: 700;">₦${order.total.toLocaleString()}</p>
            </div>
            ${order.customer.address ? `
              <div style="background: #ffffff; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-top: 15px;">
                <p style="margin: 0 0 8px 0; color: #6c757d; font-size: 14px; font-weight: 500;">📍 DELIVERY ADDRESS</p>
                <p style="margin: 0; color: #2c3e50; font-size: 16px; line-height: 1.4;">${order.customer.address}</p>
              </div>
            ` : ''}
            ${order.notes ? `
              <div style="background: #ffffff; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-top: 15px;">
                <p style="margin: 0 0 8px 0; color: #6c757d; font-size: 14px; font-weight: 500;">📝 NOTES</p>
                <p style="margin: 0; color: #2c3e50; font-size: 16px; line-height: 1.4;">${order.notes}</p>
              </div>
            ` : ''}
          </div>
          
          <!-- Items Ordered -->
          <div style="background: #ffffff; padding: 25px; margin: 0; border: 1px solid #e9ecef;">
            <h2 style="color: #2c3e50; margin: 0 0 20px 0; font-size: 22px; font-weight: 600;">🍽️ Items Ordered</h2>
            <div style="space-y: 12px;">
              ${order.items.map(item => `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 15px; background: #f8f9fa; border-radius: 8px; margin-bottom: 12px; border-left: 4px solid #d32f2f;">
                  <div style="flex: 1;">
                    <p style="margin: 0 0 4px 0; color: #2c3e50; font-size: 14px; font-weight: 600;">${item.name}</p>
                    <p style="margin: 0; color: #6c757d; font-size: 14px;">Quantity: ${item.quantity}</p>
                  </div>
                  <div style="text-align: right; flex-shrink: 0; margin-left: 15px;">
                    <p style="margin: 0; color: #d32f2f; font-size: 18px; font-weight: 700;">₦${(item.price * item.quantity).toLocaleString()}</p>
                    <p style="margin: 0; color: #6c757d; font-size: 12px;">₦${item.price.toLocaleString()} each</p>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
          
          <!-- Action Required -->
          <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); padding: 20px; text-align: center; border-radius: 0 0 12px 12px;">
            <p style="margin: 0; color: #ffffff; font-size: 16px; font-weight: 600;">⚡ Action Required: Please check your admin panel to process this order</p>
          </div>
          
          <!-- Footer -->
          <div style="text-align: center; padding: 20px; color: #6c757d; font-size: 14px;">
            <p style="margin: 0;">Order created: ${order.createdAt.toLocaleString()}</p>
            <p style="margin: 8px 0 0 0;">Thank you for using Meenos Restaurant! 🍽️</p>
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
      from: 'Meenos Restaurant <noreply@meenos.ng>',
      to: [customerEmail],
      subject: `Order Confirmation - ${order.id}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
          <!-- Header with Logo -->
          <div style="background: linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%); padding: 30px 20px; text-align: center; border-radius: 12px 12px 0 0;">
            <img src="https://meenos.ng/meenos-logo.png" alt="Meenos Restaurant" style="height: 60px; margin-bottom: 15px;" />
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">🍽️ Thank You for Your Order!</h1>
            <p style="color: #ffebee; margin: 8px 0 0 0; font-size: 16px; opacity: 0.9;">Order #${order.id}</p>
          </div>
          
          <!-- Welcome Message -->
          <div style="background: #f8f9fa; padding: 25px; margin: 0; border-left: 4px solid #28a745;">
            <h2 style="color: #2c3e50; margin: 0 0 15px 0; font-size: 22px; font-weight: 600;">👋 Hello ${order.customer.name}!</h2>
            <p style="color: #495057; margin: 0; font-size: 16px; line-height: 1.6;">We've received your order and our team is already preparing your delicious meal. Here are your order details:</p>
          </div>
          
          <!-- Order Summary -->
          <div style="background: #ffffff; padding: 25px; margin: 0; border: 1px solid #e9ecef;">
            <h2 style="color: #2c3e50; margin: 0 0 20px 0; font-size: 22px; font-weight: 600;">📋 Order Summary</h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
              <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #d32f2f;">
                <p style="margin: 0 0 8px 0; color: #6c757d; font-size: 14px; font-weight: 500;">ORDER TYPE</p>
                <p style="margin: 0; color: #2c3e50; font-size: 16px; font-weight: 600; text-transform: capitalize;">${order.orderType}</p>
              </div>
              <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #28a745;">
                <p style="margin: 0 0 8px 0; color: #6c757d; font-size: 14px; font-weight: 500;">STATUS</p>
                <p style="margin: 0; color: #28a745; font-size: 16px; font-weight: 600; text-transform: uppercase;">${order.status}</p>
              </div>
            </div>
            <div style="background: linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%); padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 20px;">
              <p style="margin: 0 0 8px 0; color: #ffffff; font-size: 14px; font-weight: 500; opacity: 0.9;">TOTAL AMOUNT</p>
              <p style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700;">₦${order.total.toLocaleString()}</p>
            </div>
            ${order.customer.address ? `
              <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #17a2b8;">
                <p style="margin: 0 0 8px 0; color: #6c757d; font-size: 14px; font-weight: 500;">📍 DELIVERY ADDRESS</p>
                <p style="margin: 0; color: #2c3e50; font-size: 16px; line-height: 1.4;">${order.customer.address}</p>
              </div>
            ` : ''}
            ${order.notes ? `
              <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107; margin-top: 15px;">
                <p style="margin: 0 0 8px 0; color: #6c757d; font-size: 14px; font-weight: 500;">📝 SPECIAL NOTES</p>
                <p style="margin: 0; color: #2c3e50; font-size: 16px; line-height: 1.4;">${order.notes}</p>
              </div>
            ` : ''}
          </div>
          
          <!-- Items Ordered -->
          <div style="background: #ffffff; padding: 25px; margin: 0; border: 1px solid #e9ecef;">
            <h2 style="color: #2c3e50; margin: 0 0 20px 0; font-size: 22px; font-weight: 600;">🍽️ Your Delicious Order</h2>
            <div style="space-y: 12px;">
              ${order.items.map(item => `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 15px; background: #f8f9fa; border-radius: 8px; margin-bottom: 12px; border-left: 4px solid #d32f2f;">
                  <div style="flex: 1;">
                    <p style="margin: 0 0 4px 0; color: #2c3e50; font-size: 14px; font-weight: 600;">${item.name}</p>
                    <p style="margin: 0; color: #6c757d; font-size: 14px;">Quantity: ${item.quantity}</p>
                  </div>
                  <div style="text-align: right; flex-shrink: 0; margin-left: 15px;">
                    <p style="margin: 0; color: #d32f2f; font-size: 18px; font-weight: 700;">₦${(item.price * item.quantity).toLocaleString()}</p>
                    <p style="margin: 0; color: #6c757d; font-size: 12px;">₦${item.price.toLocaleString()} each</p>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
          
          <!-- Next Steps -->
          <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); padding: 25px; text-align: center; margin: 0;">
            <h2 style="color: #ffffff; margin: 0 0 15px 0; font-size: 22px; font-weight: 600;">⏰ What's Next?</h2>
            <p style="margin: 0 0 15px 0; color: #ffffff; font-size: 16px; line-height: 1.6;">We'll contact you soon to confirm your order and provide an estimated delivery time.</p>
            <p style="margin: 0; color: #ffffff; font-size: 16px; font-weight: 600;">Thank you for choosing Meenos Restaurant! 🍽️</p>
          </div>
          
          <!-- Footer -->
          <div style="text-align: center; padding: 20px; color: #6c757d; font-size: 14px; border-radius: 0 0 12px 12px; background: #f8f9fa;">
            <p style="margin: 0;">Order created: ${order.createdAt.toLocaleString()}</p>
            <p style="margin: 8px 0 0 0;">Questions? Contact us at your convenience! 📞</p>
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
