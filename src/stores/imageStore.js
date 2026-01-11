import { defineStore } from 'pinia';
import { ref } from 'vue';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const useImageStore = defineStore('image', () => {
  const image = ref(null);
  const error = ref('');
  const isDragging = ref(false);
  const isLoadingUrl = ref(false);

  function validateFile(file) {
    error.value = '';
    
    if (!ALLOWED_TYPES.includes(file.type)) {
      error.value = 'Please select a JPEG, PNG, or WebP image';
      return false;
    }
    
    if (file.size > MAX_FILE_SIZE) {
      error.value = `File size must be less than ${(MAX_FILE_SIZE / (1024 * 1024)).toFixed(0)}MB`;
      return false;
    }
    
    return true;
  }

  function processFile(file) {
    if (!validateFile(file)) {
      return;
    }
    
    const url = URL.createObjectURL(file);
    const img = new Image();
    
    img.onload = () => {
      // Clean up previous image URL
      if (image.value?.url) {
        URL.revokeObjectURL(image.value.url);
      }
      
      image.value = {
        name: file.name,
        size: file.size,
        width: img.naturalWidth,
        height: img.naturalHeight,
        url: url
      };
    };
    
    img.onerror = () => {
      error.value = 'Failed to load image. Please try another file.';
      URL.revokeObjectURL(url);
    };
    
    img.src = url;
  }

  function loadImageFromUrl(imageUrl) {
    error.value = '';
    isLoadingUrl.value = true;

    // Basic URL validation
    try {
      new URL(imageUrl);
    } catch {
      error.value = 'Please enter a valid URL';
      isLoadingUrl.value = false;
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      // Clean up previous image URL if it was a blob
      if (image.value?.url && image.value.url.startsWith('blob:')) {
        URL.revokeObjectURL(image.value.url);
      }
      
      // Extract filename from URL
      const urlObj = new URL(imageUrl);
      const pathname = urlObj.pathname;
      const filename = pathname.substring(pathname.lastIndexOf('/') + 1) || 'image';
      
      image.value = {
        name: filename,
        size: null, // Size not available for URLs
        width: img.naturalWidth,
        height: img.naturalHeight,
        url: imageUrl
      };
      
      isLoadingUrl.value = false;
    };
    
    img.onerror = () => {
      error.value = 'Failed to load image from URL. Please check the URL and try again.';
      isLoadingUrl.value = false;
    };
    
    img.src = imageUrl;
  }

  function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
      processFile(file);
    }
  }

  function handleDrop(event) {
    isDragging.value = false;
    const file = event.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  }

  function setDragging(value) {
    isDragging.value = value;
  }

  return {
    image,
    error,
    isDragging,
    isLoadingUrl,
    handleFileSelect,
    handleDrop,
    setDragging,
    loadImageFromUrl
  };
});
