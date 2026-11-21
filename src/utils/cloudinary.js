// src/utils/cloudinary.js
import imageCompression from 'browser-image-compression';

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const API_KEY = import.meta.env.VITE_CLOUDINARY_API_KEY;
const API_SECRET = import.meta.env.VITE_CLOUDINARY_API_SECRET;

// Browser ke built-in Web Crypto API se SHA-1 signature generate karna
const generateSignature = async (paramsString) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(paramsString + API_SECRET);
  const hashBuffer = await crypto.subtle.digest('SHA-1', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
};

// Image compress helper (original width & height same rahegi, sirf file size kam hoga)
const compressImage = async (file) => {
  // Agar file pehle se 300KB se kam hai toh compress mat karo
  if (file.size / 1024 / 1024 <= 0.3) {
    return file;
  }

  const options = {
    maxSizeMB: 0.5,          // Max ~500KB
    useWebWorker: true,      // UI freeze nahi hoga
    initialQuality: 0.8,     // Quality 80% se start karega
    fileType: 'image/webp',  // Transparent PNG bhi support karta hai + size kam hota hai
  };

  return await imageCompression(file, options);
};

/**
 * Compresses and uploads an image to Cloudinary directly from Vite frontend.
 * @param {File} file - Image file from input[type="file"]
 * @param {string} folder - Folder name in Cloudinary (e.g., 'brands', 'vehicles')
 * @returns {Promise<string>} - Uploaded image secure_url
 */
export const uploadImageToCloudinary = async (file, folder = 'general') => {
  if (!file) throw new Error('No file provided');
  if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
    throw new Error('Cloudinary env variables missing hain');
  }

  // 1. Pehle image compress karo
  const compressedFile = await compressImage(file);

  // 2. Cloudinary signature generate karo (alphabetically sorted: folder -> timestamp)
  const timestamp = Math.round(new Date().getTime() / 1000);
  const paramsToSign = `folder=${folder}&timestamp=${timestamp}`;
  const signature = await generateSignature(paramsToSign);

  const formData = new FormData();
  formData.append('file', compressedFile);
  formData.append('api_key', API_KEY);
  formData.append('timestamp', timestamp);
  formData.append('folder', folder);
  formData.append('signature', signature);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error?.message || 'Cloudinary upload failed');
  }

  return data.secure_url;
};