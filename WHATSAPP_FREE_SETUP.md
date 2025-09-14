# Free WhatsApp Setup Guide

This guide shows you how to set up **completely free** WhatsApp notifications using CallMeBot.

## CallMeBot Setup (100% Free)

### Step 1: Add CallMeBot to Your WhatsApp

1. Open WhatsApp on your phone
2. Send this message to **+34 644 44 44 45**:
   ```
   I allow callmebot to send me messages
   ```
3. You'll receive a confirmation message with your API key

### Step 2: Get Your API Key

After sending the message, you'll receive a response like:
```
Your API key is: 1234567890
```

### Step 3: Configure Your Environment Variables

Add this to your `.env.local` file:

```env
# CallMeBot WhatsApp (FREE)
WHATSAPP_FREE_WEBHOOK_URL=https://api.callmebot.com/whatsapp.php?phone=YOUR_PHONE&text=MESSAGE&apikey=YOUR_API_KEY
ADMIN_PHONE=+2348000000000
ENABLE_WHATSAPP_NOTIFICATIONS=true
```

**Replace:**
- `YOUR_PHONE` with your phone number (with country code, no + sign)
- `YOUR_API_KEY` with the API key you received
- `+2348000000000` with your actual phone number

### Step 4: Test Your Setup

1. Go to your admin panel: `/admin/notifications`
2. Click "Send Test" button
3. Check your WhatsApp for the test message

## Example Configuration

If your phone is +234 801 234 5678 and your API key is 1234567890:

```env
WHATSAPP_FREE_WEBHOOK_URL=https://api.callmebot.com/whatsapp.php?phone=2348012345678&text=MESSAGE&apikey=1234567890
ADMIN_PHONE=+2348012345678
ENABLE_WHATSAPP_NOTIFICATIONS=true
```

## Troubleshooting

### No messages received?
1. Check that you sent the activation message to +34 644 44 44 45
2. Verify your API key is correct
3. Make sure your phone number format is correct (no + sign in the URL)
4. Check your server logs for error messages

### API key not working?
1. Try sending the activation message again
2. Wait a few minutes and try again
3. Make sure you're using the exact phone number that sent the activation message

### Rate limits?
CallMeBot is free but may have rate limits. If you hit limits:
1. Wait a few minutes between messages
2. Consider upgrading to Green API (1000 free messages/month)
3. Or use a paid service for high volume

## Benefits of CallMeBot

✅ **Completely Free** - No cost, no credit card required
✅ **Unlimited Messages** - No monthly limits
✅ **Easy Setup** - Just send one WhatsApp message
✅ **Reliable** - Works consistently
✅ **No Registration** - No account creation needed

## Alternative: Green API (1000 free messages/month)

If you need more reliability or hit CallMeBot limits:

1. Sign up at [Green API](https://green-api.com/)
2. Get your instance ID and token
3. Use this webhook URL format:
   ```
   https://api.green-api.com/waInstanceYOUR_INSTANCE/sendMessage/YOUR_TOKEN
   ```

## Next Steps

Once you have WhatsApp working:
1. Set up email notifications with Resend (also free tier available)
2. Test with real orders
3. Monitor your notification delivery
4. Consider upgrading to paid services only if you need high volume
