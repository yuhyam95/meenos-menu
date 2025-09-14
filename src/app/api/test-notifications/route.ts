import { NextRequest, NextResponse } from 'next/server';
import { sendOrderNotifications, getNotificationConfig } from '@/lib/notifications';
import type { Order } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    // Create a test order
    const testOrder: Order = {
      id: 'TEST-' + Date.now(),
      customer: {
        name: 'Test Customer',
        phone: '+2348000000000',
        address: '123 Test Street, Lagos'
      },
      items: [
        {
          id: '1',
          name: 'Test Item 1',
          price: 1500,
          quantity: 2,
          image: '/test-image.jpg',
          category: 'Test Category',
          description: 'Test description'
        },
        {
          id: '2',
          name: 'Test Item 2',
          price: 2000,
          quantity: 1,
          image: '/test-image2.jpg',
          category: 'Test Category',
          description: 'Test description 2'
        }
      ],
      total: 5000,
      status: 'Pending',
      orderType: 'delivery',
      notes: 'This is a test order for notification testing',
      createdAt: new Date()
    };

    const config = getNotificationConfig();
    
    // Add test customer phone to config
    const notificationConfig = {
      ...config,
      customerPhone: testOrder.customer.phone
    };

    const results = await sendOrderNotifications(testOrder, notificationConfig);

    return NextResponse.json({
      success: true,
      message: 'Test notifications sent',
      results: {
        email: results.email.success ? 'sent' : `failed: ${results.email.error}`,
        whatsapp: results.whatsapp.success ? 'sent' : `failed: ${results.whatsapp.error}`,
        customerEmail: results.customerEmail.success ? 'sent' : `failed: ${results.customerEmail.error}`,
        customerWhatsApp: results.customerWhatsApp.success ? 'sent' : `failed: ${results.customerWhatsApp.error}`
      }
    });
  } catch (error) {
    console.error('Error testing notifications:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
