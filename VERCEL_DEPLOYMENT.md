# Vercel Deployment Guide

This guide will help you deploy your Meenos Menu application to Vercel.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Your code should be in a GitHub repository
3. **Environment Variables**: Prepare your production environment variables

## Required Environment Variables

You'll need to set up the following environment variables in Vercel:

### Database
```
MONGODB_URI=your_mongodb_connection_string_here
```

### Cloudinary
```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

## Deployment Methods

### Method 1: Deploy via Vercel Dashboard (Recommended)

1. **Connect Repository**:
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Select your repository and click "Import"

2. **Configure Project**:
   - **Framework Preset**: Next.js (should be auto-detected)
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

3. **Set Environment Variables**:
   - Go to Project Settings → Environment Variables
   - Add all the required environment variables listed above
   - Make sure to set them for "Production", "Preview", and "Development"

4. **Deploy**:
   - Click "Deploy"
   - Wait for the build to complete
   - Your app will be available at the provided URL

### Method 2: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

4. **Set Environment Variables**:
   ```bash
   vercel env add MONGODB_URI
   vercel env add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
   vercel env add NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
   vercel env add CLOUDINARY_API_KEY
   vercel env add CLOUDINARY_API_SECRET
   ```

5. **Redeploy with Environment Variables**:
   ```bash
   vercel --prod
   ```

## Post-Deployment Configuration

### 1. MongoDB Atlas Setup
- Ensure your MongoDB Atlas cluster allows connections from Vercel's IP ranges
- Add `0.0.0.0/0` to your IP whitelist for development, or use Vercel's specific IP ranges for production

### 2. Cloudinary Configuration
- Verify your Cloudinary upload preset is set to "unsigned"
- Test image uploads in the deployed application
- Check that images are displaying correctly

### 3. Domain Configuration (Optional)
- Add a custom domain in Vercel dashboard
- Configure DNS settings as instructed by Vercel

## Testing Your Deployment

1. **Basic Functionality**:
   - Visit your deployed URL
   - Check that the homepage loads correctly
   - Verify menu items are displayed

2. **Admin Panel**:
   - Navigate to `/admin`
   - Test login functionality
   - Try adding/editing menu items
   - Test image uploads

3. **Order System**:
   - Add items to cart
   - Test checkout process
   - Verify order notes functionality
   - Check admin order management

## Troubleshooting

### Build Failures
- Check the build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify TypeScript compilation passes locally

### Environment Variables Issues
- Double-check variable names (case-sensitive)
- Ensure all required variables are set
- Redeploy after adding new environment variables

### Database Connection Issues
- Verify MongoDB URI is correct
- Check MongoDB Atlas network access settings
- Ensure database user has proper permissions

### Image Upload Issues
- Verify Cloudinary credentials are correct
- Check upload preset configuration
- Test with different image formats and sizes

## Performance Optimization

### 1. Enable Vercel Analytics
- Go to Project Settings → Analytics
- Enable Vercel Analytics for performance monitoring

### 2. Configure Caching
- Vercel automatically handles static asset caching
- Consider implementing ISR (Incremental Static Regeneration) for menu items

### 3. Database Optimization
- Use MongoDB indexes for frequently queried fields
- Consider implementing connection pooling

## Security Considerations

1. **Environment Variables**: Never commit sensitive data to your repository
2. **API Routes**: Implement proper authentication for admin routes
3. **CORS**: Configure CORS settings if needed
4. **Rate Limiting**: Consider implementing rate limiting for API routes

## Monitoring and Maintenance

1. **Vercel Dashboard**: Monitor deployment status and performance
2. **Error Tracking**: Set up error monitoring (e.g., Sentry)
3. **Logs**: Use Vercel's function logs for debugging
4. **Updates**: Regularly update dependencies and redeploy

## Support

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Next.js Deployment**: [nextjs.org/docs/deployment](https://nextjs.org/docs/deployment)
- **Vercel Community**: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)

