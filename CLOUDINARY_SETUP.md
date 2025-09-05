# Cloudinary Setup Guide

This guide will help you set up Cloudinary for image storage in your Meenos Menu application.

## 1. Create a Cloudinary Account

1. Go to [Cloudinary.com](https://cloudinary.com) and sign up for a free account
2. Verify your email address

## 2. Get Your Cloudinary Credentials

1. Log into your Cloudinary dashboard
2. Go to the "Dashboard" section
3. Note down your:
   - **Cloud Name** (e.g., `your-cloud-name`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (e.g., `abcdefghijklmnopqrstuvwxyz123456`)

## 3. Create an Upload Preset

1. In your Cloudinary dashboard, go to "Settings" → "Upload"
2. Scroll down to "Upload presets"
3. Click "Add upload preset"
4. Configure the preset:
   - **Preset name**: `meenos-menu-uploads` (or any name you prefer)
   - **Signing Mode**: `Unsigned` (for client-side uploads)
   - **Folder**: `meenos-menu` (optional, for organization)
   - **Transformation**: You can add default transformations here
5. Click "Save"

## 4. Set Up Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset_here

# Optional: For server-side operations (if needed)
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

Replace the placeholder values with your actual Cloudinary credentials.

## 5. Configure Next.js for Cloudinary Images

The `next.config.ts` file has been updated to include Cloudinary's hostname (`res.cloudinary.com`) in the allowed remote patterns. This allows Next.js Image component to load images from Cloudinary.

## 6. Test the Integration

1. Start your development server: `npm run dev`
2. Go to the admin panel: `/admin/menu`
3. Try adding a new menu item with an image
4. The image should upload to Cloudinary and display properly

## Features

- ✅ **Client-side uploads**: Images are uploaded directly from the browser to Cloudinary
- ✅ **Automatic optimization**: Cloudinary automatically optimizes images for web
- ✅ **CDN delivery**: Images are served from Cloudinary's global CDN
- ✅ **File validation**: Only image files up to 5MB are accepted
- ✅ **Preview functionality**: See image preview before saving
- ✅ **Error handling**: Proper error messages for failed uploads
- ✅ **Drag & Drop**: Modern drag-and-drop interface
- ✅ **Next.js Compatible**: Properly configured for Next.js client/server architecture

## Security Notes

- The upload preset is set to "unsigned" for client-side uploads
- File type and size validation is implemented
- API secrets are only used server-side (if needed)
- Consider setting up folder organization in Cloudinary for better management

## Troubleshooting

### "Module not found: Can't resolve 'fs'" Error
This error occurs when the Cloudinary SDK tries to use Node.js modules in the browser. The solution is implemented in this project:
- Client-side code uses direct API calls to Cloudinary
- Server-side code uses the full Cloudinary SDK
- The `SimpleImageUpload` component handles client-side uploads without Node.js dependencies

### Upload fails
- Check that your environment variables are set correctly
- Verify that the upload preset exists and is set to "unsigned"
- Check the browser console for error messages
- Ensure your Cloudinary account has sufficient storage quota

### Images not displaying
- Ensure the Cloudinary URL is being saved correctly
- Check that the image URL is accessible
- Verify that the image component is receiving the correct URL
- Check if the image was uploaded successfully to Cloudinary

### File size issues
- The current limit is 5MB per image
- You can adjust this in the `SimpleImageUpload` component if needed
- Consider implementing image compression before upload

### Environment variables not working
- Make sure your `.env.local` file is in the project root
- Restart your development server after adding environment variables
- Check that variable names match exactly (case-sensitive)

### "hostname is not configured" Error
If you see an error about `res.cloudinary.com` not being configured:
- The `next.config.ts` file has been updated to include Cloudinary's hostname
- Restart your development server after the configuration change
- Make sure you're using the latest version of the configuration

## Next Steps

1. Set up your Cloudinary account and get your credentials
2. Create the upload preset
3. Add the environment variables to your `.env.local` file
4. Test the image upload functionality
5. Consider setting up image transformations for different sizes (thumbnails, etc.)
