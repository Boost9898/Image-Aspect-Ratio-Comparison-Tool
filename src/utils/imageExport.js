/**
 * Export an image cropped to a specific aspect ratio
 * @param {string} imageUrl - URL of the source image
 * @param {number} originalWidth - Original image width
 * @param {number} originalHeight - Original image height
 * @param {number} targetRatio - Target aspect ratio (width/height)
 * @param {Object} focalPoint - Focal point {x: 0-100, y: 0-100}
 * @param {string} filename - Output filename
 */
export async function exportImage(imageUrl, originalWidth, originalHeight, targetRatio, focalPoint, filename) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      try {
        // Calculate crop dimensions
        const imageRatio = originalWidth / originalHeight;
        let cropWidth, cropHeight, cropX, cropY;
        
        if (imageRatio > targetRatio) {
          // Image is wider - crop width, keep full height
          cropHeight = originalHeight;
          cropWidth = originalHeight * targetRatio;
          
          // Calculate X position based on focal point
          const maxOffset = originalWidth - cropWidth;
          cropX = (focalPoint.x / 100) * maxOffset;
          cropY = 0;
        } else {
          // Image is taller or equal - crop height, keep full width
          cropWidth = originalWidth;
          cropHeight = originalWidth / targetRatio;
          
          // Calculate Y position based on focal point
          const maxOffset = originalHeight - cropHeight;
          cropX = 0;
          cropY = (focalPoint.y / 100) * maxOffset;
        }
        
        // Create canvas with crop dimensions
        const canvas = document.createElement('canvas');
        canvas.width = cropWidth;
        canvas.height = cropHeight;
        
        const ctx = canvas.getContext('2d');
        
        // Draw the cropped portion of the image
        ctx.drawImage(
          img,
          cropX, cropY, cropWidth, cropHeight,  // Source rectangle
          0, 0, cropWidth, cropHeight            // Destination rectangle
        );
        
        // Convert canvas to blob and download
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            resolve();
          } else {
            reject(new Error('Failed to create image blob'));
          }
        }, 'image/png');
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    img.src = imageUrl;
  });
}

/**
 * Generate filename for exported image
 * @param {string} originalName - Original filename
 * @param {string} ratioLabel - Aspect ratio label
 * @returns {string} Generated filename
 */
export function generateExportFilename(originalName, ratioLabel) {
  // Remove extension from original name
  const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');
  
  // Clean ratio label (remove special chars, replace spaces)
  const cleanRatio = ratioLabel.replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
  
  return `${nameWithoutExt}_${cleanRatio}.png`;
}

/**
 * Helper function to get cropped image data for a specific ratio
 */
async function getCroppedImageData(imageUrl, originalWidth, originalHeight, targetRatio, focalPoint) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      try {
        // Calculate crop dimensions
        const imageRatio = originalWidth / originalHeight;
        let cropWidth, cropHeight, cropX, cropY;
        
        if (imageRatio > targetRatio) {
          cropHeight = originalHeight;
          cropWidth = originalHeight * targetRatio;
          const maxOffset = originalWidth - cropWidth;
          cropX = (focalPoint.x / 100) * maxOffset;
          cropY = 0;
        } else {
          cropWidth = originalWidth;
          cropHeight = originalWidth / targetRatio;
          const maxOffset = originalHeight - cropHeight;
          cropX = 0;
          cropY = (focalPoint.y / 100) * maxOffset;
        }
        
        const canvas = document.createElement('canvas');
        canvas.width = cropWidth;
        canvas.height = cropHeight;
        const ctx = canvas.getContext('2d');
        
        ctx.drawImage(
          img,
          cropX, cropY, cropWidth, cropHeight,
          0, 0, cropWidth, cropHeight
        );
        
        resolve({ canvas, width: cropWidth, height: cropHeight });
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = imageUrl;
  });
}

/**
 * Export a composite image with all selected ratios side by side with labels
 * @param {string} imageUrl - URL of the source image
 * @param {number} originalWidth - Original image width
 * @param {number} originalHeight - Original image height
 * @param {Array} ratios - Array of ratio objects: [{ratio: number, label: string}, ...]
 * @param {Object} focalPoint - Focal point {x: 0-100, y: 0-100}
 * @param {string} filename - Output filename
 */
export async function exportCompositeImage(imageUrl, originalWidth, originalHeight, ratios, focalPoint, filename) {
  try {
    const padding = 40; // Padding between images
    const topPadding = 80; // Space for labels at top
    const bottomPadding = 40; // Bottom padding
    const maxHeight = 800; // Max height for each preview
    
    // Get all cropped images
    const croppedImages = await Promise.all(
      ratios.map(({ ratio }) => 
        getCroppedImageData(imageUrl, originalWidth, originalHeight, ratio, focalPoint)
      )
    );
    
    // Scale images to fit maxHeight while maintaining aspect ratios
    const scaledImages = croppedImages.map(({ canvas, width, height }) => {
      const scale = Math.min(1, maxHeight / height);
      return {
        canvas,
        scaledWidth: width * scale,
        scaledHeight: height * scale
      };
    });
    
    // Calculate total canvas size
    const totalWidth = scaledImages.reduce((sum, img) => sum + img.scaledWidth, 0) + 
                       (padding * (scaledImages.length + 1));
    const maxScaledHeight = Math.max(...scaledImages.map(img => img.scaledHeight));
    const totalHeight = topPadding + maxScaledHeight + bottomPadding;
    
    // Create composite canvas
    const compositeCanvas = document.createElement('canvas');
    compositeCanvas.width = totalWidth;
    compositeCanvas.height = totalHeight;
    const ctx = compositeCanvas.getContext('2d');
    
    // Fill background
    ctx.fillStyle = '#f7fafc';
    ctx.fillRect(0, 0, totalWidth, totalHeight);
    
    // Draw each image with label
    let currentX = padding;
    
    scaledImages.forEach(({ canvas, scaledWidth, scaledHeight }, index) => {
      // Draw label
      ctx.fillStyle = '#2d3748';
      ctx.font = 'bold 20px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(ratios[index].label, currentX + scaledWidth / 2, 35);
      
      // Draw dimensions
      const dimensions = `${Math.round(canvas.width)} × ${Math.round(canvas.height)}px`;
      ctx.fillStyle = '#718096';
      ctx.font = '16px system-ui, -apple-system, sans-serif';
      ctx.fillText(dimensions, currentX + scaledWidth / 2, 60);
      
      // Draw white background for image
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(currentX, topPadding, scaledWidth, scaledHeight);
      
      // Draw image
      ctx.drawImage(canvas, currentX, topPadding, scaledWidth, scaledHeight);
      
      // Draw border
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 2;
      ctx.strokeRect(currentX, topPadding, scaledWidth, scaledHeight);
      
      currentX += scaledWidth + padding;
    });
    
    // Convert to blob and download
    return new Promise((resolve, reject) => {
      compositeCanvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          resolve();
        } else {
          reject(new Error('Failed to create composite image blob'));
        }
      }, 'image/png');
    });
  } catch (error) {
    throw error;
  }
}
