<script setup>
import { computed } from 'vue';
import { useImageStore } from '../stores/imageStore.js';

const props = defineProps({
  ratio: Number,
  ratioLabel: String,
  imageUrl: String,
  displayMode: String,
  imageStyle: Object,
  focalPoint: Object
});

const imageStore = useImageStore();

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
</script>

<template>
  <div class="preview-card">
    <div class="preview-card__header">
      <h3>{{ ratioLabel }}</h3>
      <span class="preview-card__dimensions">
        {{ croppedWidth }} × {{ croppedHeight }}px
      </span>
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
  align-items: baseline;
  flex-wrap: wrap;
  gap: 0.5rem;
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
</style>
