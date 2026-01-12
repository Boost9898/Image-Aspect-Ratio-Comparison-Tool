<script setup>
import { computed, ref } from 'vue';
import { useImageStore } from '../stores/imageStore.js';
import { exportImage, generateExportFilename } from '../utils/imageExport.js';

const props = defineProps({
  ratio: Number,
  ratioLabel: String,
  imageUrl: String,
  displayMode: String,
  imageStyle: Object,
  focalPoint: Object
});

const imageStore = useImageStore();
const isExporting = ref(false);

// Calculate actual cropped dimensions of the original image
const croppedWidth = computed(() => {
  if (!imageStore.image) return 0;
  
  const imageRatio = imageStore.image.width / imageStore.image.height;
  const targetRatio = props.ratio;
  
  // Calculate the crop dimensions
  if (imageRatio > targetRatio) {
    // Image is wider - height stays full, width gets cropped
    return Math.round(imageStore.image.height * targetRatio);
  } else {
    // Image is taller or equal - width stays full
    return imageStore.image.width;
  }
});

const croppedHeight = computed(() => {
  if (!imageStore.image) return 0;
  
  const imageRatio = imageStore.image.width / imageStore.image.height;
  const targetRatio = props.ratio;
  
  // Calculate the crop dimensions
  if (imageRatio > targetRatio) {
    // Image is wider - height stays full
    return imageStore.image.height;
  } else {
    // Image is taller - height gets cropped, width stays full
    return Math.round(imageStore.image.width / targetRatio);
  }
});

async function handleExport() {
  if (!imageStore.image || isExporting.value) return;
  
  isExporting.value = true;
  
  try {
    const filename = generateExportFilename(imageStore.image.name, props.ratioLabel);
    
    await exportImage(
      props.imageUrl,
      imageStore.image.width,
      imageStore.image.height,
      props.ratio,
      props.focalPoint,
      filename
    );
  } catch (error) {
    console.error('Export failed:', error);
    alert('Failed to export image. Please try again.');
  } finally {
    isExporting.value = false;
  }
}
</script>

<template>
  <div class="preview-card">
    <div class="preview-card__header">
      <div class="preview-card__title-group">
        <h3>{{ ratioLabel }}</h3>
        <span class="preview-card__dimensions">
          {{ croppedWidth }} × {{ croppedHeight }}px
        </span>
      </div>
      <button 
        @click="handleExport" 
        :disabled="isExporting"
        class="download-btn"
        :title="`Download ${ratioLabel}`"
      >
        <svg v-if="!isExporting" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
        <span v-if="isExporting" class="spinner"></span>
      </button>
    </div>
    
    <div
      class="preview-card__viewport"
      :style="{
        paddingBottom: `${(1 / ratio) * 100}%`,
        maxWidth: '400px'
      }"
    >
      <div class="preview-card__image-wrapper">
        <!-- Cropped image -->
        <img
          :src="imageUrl"
          :alt="`${ratioLabel} preview`"
          :style="imageStyle"
          class="preview-card__image"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.preview-card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.preview-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.preview-card__title-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.preview-card__header h3 {
  margin: 0;
  color: #2d3748;
  font-size: 1.1rem;
}

.preview-card__dimensions {
  font-size: 0.9rem;
  color: #718096;
  font-weight: 600;
}

.preview-card__viewport {
  position: relative;
  width: 100%;
  background: #f1f5f9;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.preview-card__image-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.preview-card__image {
  width: 100%;
  height: 100%;
}

.download-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
  width: 36px;
  height: 36px;
}

.download-btn:hover:not(:disabled) {
  background: #5a67d8;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
}

.download-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
