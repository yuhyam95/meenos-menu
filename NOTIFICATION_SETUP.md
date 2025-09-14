# Notification Setup Guide

This guide explains how to set up email and WhatsApp notifications for new orders.

## Environment Variables

Add these variables to your `.env.local` file:

### Email Notifications (Resend)
```env
# Email service
RESEND_API_KEY=your-resend-api-key
ADMIN_EMAIL=admin@meenos.com
ENABLE_EMAIL_NOTIFICATIONS=true
ENABLE_CUSTOMER_NOTIFICATIONS=true
```

### WhatsApp Notifications

#### Option 1: Using a Webhook Service
```env
WHATSAPP_WEBHOOK_URL=https://your-webhook-service.com/send-message
WHATSAPP_API_TOKEN=your-webhook-api-token
ADMIN_PHONE=+2348000000000
ENABLE_WHATSAPP_NOTIFICATIONS=true
```

#### Option 2: Using Twilio WhatsApp API
```env
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_WHATSAPP_NUMBER=+14155238886
ADMIN_PHONE=+2348000000000
ENABLE_WHATSAPP_NOTIFICATIONS=true
```

### Optional Customer Notifications
```env
CUSTOMER_EMAIL=optional-customer-email@example.com
CUSTOMER_PHONE=+2348000000000
```

## Setup Instructions

### 1. Email Setup (Resend)

1. Sign up at [Resend](https://resend.com)
2. Get your API key from the dashboard
3. Add `RESEND_API_KEY` to your environment variables
4. Set your admin email address

### 2. WhatsApp Setup

#### Option A: Using a Webhook Service
1. Use services like:
   - [WhatsApp Business API](https://developers.facebook.com/docs/whatsapp)
   - [Twilio WhatsApp](https://www.twilio.com/whatsapp)
   - [360Dialog](https://www.360dialog.com/)
   - [MessageBird](https://www.messagebird.com/)

2. Set up your webhook endpoint
3. Add the webhook URL and API token to your environment variables

#### Option B: Using Twilio (Recommended)
1. Sign up at [Twilio](https://www.twilio.com)
2. Enable WhatsApp Sandbox or get WhatsApp Business API access
3. Get your Account SID and Auth Token
4. Add the credentials to your environment variables

### 3. Phone Number Format

- Use international format: `+2348000000000`
- Include country code (e.g., +234 for Nigeria)
- No spaces or special characters

## Testing

1. Place a test order through your application
2. Check your email inbox for admin notifications
3. Check WhatsApp for admin notifications
4. Check server logs for notification status

## Troubleshooting

### Email Not Working
- Verify your Resend API key is correct
- Check that your domain is verified in Resend
- Ensure `ENABLE_EMAIL_NOTIFICATIONS=true`

### WhatsApp Not Working
- Verify phone numbers are in correct format
- Check webhook URL is accessible
- Verify API tokens are correct
- Check server logs for error messages

### General Issues
- Check all environment variables are set
- Restart your application after adding new variables
- Check server logs for detailed error messages

## Notification Content

### Admin Email
- Order details (ID, customer, items, total)
- Customer contact information
- Delivery address (if applicable)
- Order notes
- HTML formatted for better readability

### Admin WhatsApp
- Same information as email
- Formatted for mobile viewing
- Includes emojis for better visual appeal

### Customer Notifications (Optional)
- Order confirmation
- Order details
- Thank you message
- Contact information for support

## Security Notes

- Never commit your `.env.local` file to version control
- Use strong, unique API keys
- Regularly rotate your API keys
- Monitor your API usage and costs
