# Email Notifications Setup Guide

This guide shows you how to set up **email notifications only** for new orders using Resend.

## Quick Setup (5 minutes)

### Step 1: Sign up for Resend

1. Go to [Resend](https://resend.com)
2. Sign up for a free account
3. Verify your email address

### Step 2: Get Your API Key

1. Go to your Resend dashboard
2. Navigate to "API Keys" section
3. Click "Create API Key"
4. Copy your API key (starts with `re_`)

### Step 3: Configure Environment Variables

Add this to your `.env.local` file:

```env
# Email Notifications (Required)
RESEND_API_KEY=re_your_api_key_here
ADMIN_EMAIL=your-email@example.com
ENABLE_EMAIL_NOTIFICATIONS=true
ENABLE_CUSTOMER_NOTIFICATIONS=true
```

**Replace:**
- `re_your_api_key_here` with your actual Resend API key
- `your-email@example.com` with your email address

### Step 4: Test Your Setup

1. Go to your admin panel: `/admin/notifications`
2. Click "Send Test" button
3. Check your email inbox for the test notification

## Example Configuration

```env
RESEND_API_KEY=re_1234567890abcdef
ADMIN_EMAIL=admin@meenos.com
ENABLE_EMAIL_NOTIFICATIONS=true
ENABLE_CUSTOMER_NOTIFICATIONS=true
```

## What You'll Receive

### Admin Email Notifications
- Order ID and customer details
- Complete order items list
- Total amount and payment info
- Delivery address (if applicable)
- Order notes
- Professional HTML formatting

### Customer Email Confirmations (Optional)
- Order confirmation
- Order details
- Thank you message
- Contact information

## Troubleshooting

### No emails received?
1. Check your spam/junk folder
2. Verify your API key is correct
3. Make sure your email address is valid
4. Check server logs for error messages

### API key not working?
1. Verify you copied the complete API key
2. Make sure the key starts with `re_`
3. Check that the key is active in your Resend dashboard

### Domain verification error?
The system uses `noreply@meenos.com`. Make sure you have verified the `meenos.com` domain in your Resend dashboard at [resend.com/domains](https://resend.com/domains).

## Benefits of Email Notifications

✅ **Reliable** - Email delivery is very reliable
✅ **Professional** - HTML formatted emails look great
✅ **Free Tier** - Resend offers generous free limits
✅ **Easy Setup** - No complex configuration needed
✅ **Detailed** - Complete order information included
✅ **Searchable** - Easy to find and reference orders

## Resend Free Tier Limits

- **3,000 emails per month**
- **100 emails per day**
- Perfect for small to medium restaurants

## Next Steps

1. Set up email notifications first
2. Test with real orders
3. Monitor email delivery
4. Consider WhatsApp later if needed

## Support

If you need help:
1. Check the server logs for error messages
2. Verify your environment variables
3. Test with the admin panel test button
4. Check Resend dashboard for delivery status
