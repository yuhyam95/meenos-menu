# Meenos Menu

A modern restaurant menu management system built with Next.js, featuring Cloudinary image storage, MongoDB database, and a responsive admin dashboard.

## Features

- 🍽️ **Menu Management**: Add, edit, and delete menu items with categories
- 📸 **Cloudinary Integration**: Upload and store images in the cloud
- 🛒 **Shopping Cart**: Add items to cart with quantity management
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 👨‍💼 **Admin Dashboard**: Manage orders, menu items, and store settings
- 💳 **Order Management**: Track order status and customer information
- 📝 **Order Notes**: Customers can add special instructions to orders

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, MongoDB
- **Image Storage**: Cloudinary
- **UI Components**: Radix UI, shadcn/ui
- **Forms**: React Hook Form, Zod validation

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB database
- Cloudinary account (for image storage)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables (see `.env.example`):
   ```bash
   cp .env.example .env.local
   ```

4. Configure your environment variables:
   - MongoDB connection string
   - Cloudinary credentials (see `CLOUDINARY_SETUP.md`)

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:9002](http://localhost:9002) in your browser

## Cloudinary Setup

For image storage, you'll need to set up Cloudinary. See the detailed guide in `CLOUDINARY_SETUP.md`.

Quick setup:
1. Create a Cloudinary account
2. Get your cloud name and create an upload preset
3. Add the credentials to your `.env.local` file

## Project Structure

```
src/
├── app/                 # Next.js app router
│   ├── admin/          # Admin dashboard pages
│   ├── actions.ts      # Server actions
│   └── page.tsx        # Home page
├── components/         # React components
│   ├── admin/          # Admin-specific components
│   ├── ui/             # Reusable UI components
│   └── ...
├── lib/                # Utility functions
│   ├── cloudinary.ts   # Cloudinary configuration
│   ├── db.ts          # Database connection
│   └── types.ts       # TypeScript types
└── providers/          # React context providers
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
