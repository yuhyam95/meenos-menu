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

#### Option 1: FREE WhatsApp Services (Recommended)
```env
# CallMeBot (Free)
WHATSAPP_FREE_WEBHOOK_URL=https://api.callmebot.com/whatsapp.php?phone=YOUR_PHONE&text=MESSAGE&apikey=YOUR_API_KEY
ADMIN_PHONE=+2348000000000
ENABLE_WHATSAPP_NOTIFICATIONS=true

# OR Green API (1000 free messages/month)
WHATSAPP_FREE_WEBHOOK_URL=https://api.green-api.com/waInstanceYOUR_INSTANCE/sendMessage/YOUR_TOKEN
ADMIN_PHONE=+2348000000000
ENABLE_WHATSAPP_NOTIFICATIONS=true
```

#### Option 2: Paid WhatsApp Services
```env
# Twilio WhatsApp API
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_WHATSAPP_NUMBER=+14155238886
ADMIN_PHONE=+2348000000000
ENABLE_WHATSAPP_NOTIFICATIONS=true

# OR Generic Webhook Service
WHATSAPP_WEBHOOK_URL=https://your-webhook-service.com/send-message
WHATSAPP_API_TOKEN=your-webhook-api-token
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

#### Option A: FREE WhatsApp Services (Recommended for small businesses)

**1. CallMeBot (Free)**
- Go to [CallMeBot](https://www.callmebot.com/blog/free-api-whatsapp-messages/)
- Add the bot to your WhatsApp: Send "I allow callmebot to send me messages" to +34 644 44 44 45
- Get your API key and use this webhook URL format:
  ```
  https://api.callmebot.com/whatsapp.php?phone=YOUR_PHONE&text=MESSAGE&apikey=YOUR_API_KEY
  ```

**2. WhatsApp Web API (Free but unofficial)**
- Use services like [WhatsApp Web API](https://github.com/joaomirandasa/whatsapp-web.js)
- Set up your own webhook endpoint
- Add `WHATSAPP_FREE_WEBHOOK_URL` to your environment variables

**3. Green API (Free tier available)**
- Sign up at [Green API](https://green-api.com/)
- Get 1000 free messages per month
- Use their webhook service

#### Option B: Paid WhatsApp Services (For high volume)

**1. Twilio WhatsApp**
- Sign up at [Twilio](https://www.twilio.com)
- Enable WhatsApp Sandbox or get WhatsApp Business API access
- Get your Account SID and Auth Token
- Add the credentials to your environment variables

**2. Other Paid Services**
- [WhatsApp Business API](https://developers.facebook.com/docs/whatsapp) - Facebook's official API
- [360Dialog](https://www.360dialog.com/) - WhatsApp Business API provider
- [MessageBird](https://www.messagebird.com/) - Communication platform

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

## Cost Comparison

### FREE Options (Recommended for small businesses)
- **CallMeBot**: Completely free, unlimited messages
- **Green API**: 1000 free messages per month
- **WhatsApp Web API**: Free but requires technical setup

### Paid Options (For high volume businesses)
- **Twilio WhatsApp**: ~$0.005 per message
- **WhatsApp Business API**: ~$0.005-0.01 per message
- **360Dialog**: ~$0.005-0.01 per message
- **MessageBird**: ~$0.005-0.01 per message

### Recommendation
- **Start with CallMeBot** (free) for testing and small volume
- **Upgrade to Green API** when you need more than 1000 messages/month
- **Consider paid services** only when you have high volume (1000+ messages/day)

## Security Notes

- Never commit your `.env.local` file to version control
- Use strong, unique API keys
- Regularly rotate your API keys
- Monitor your API usage and costs
- Free services may have rate limits - monitor usage
