// Client-side Cloudinary configuration
// Note: We don't import the full Cloudinary SDK on the client side
// to avoid Node.js modules like 'fs' being bundled for the browser

// Upload image to Cloudinary
export async function uploadImageToCloudinary(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '');
    formData.append('cloud_name', process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '');

    fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then(data => {
        if (data.secure_url) {
          resolve(data.secure_url);
        } else {
          reject(new Error('Failed to upload image'));
        }
      })
      .catch(error => {
        reject(error);
      });
  });
}

// Delete image from Cloudinary (client-side)
export async function deleteImageFromCloudinary(publicId: string): Promise<void> {
  try {
    const response = await fetch('/api/cloudinary/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ publicId }),
    });

    if (!response.ok) {
      throw new Error('Failed to delete image');
    }
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    throw error;
  }
}

// Extract public ID from Cloudinary URL
export function extractPublicIdFromUrl(url: string): string | null {
  const regex = /\/v\d+\/(.+)\.(jpg|jpeg|png|gif|webp)$/;
  const match = url.match(regex);
  return match ? match[1] : null;
}
