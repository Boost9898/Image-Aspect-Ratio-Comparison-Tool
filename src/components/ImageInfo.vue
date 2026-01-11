<script setup>
import { formatFileSize, formatRatio } from '../utils/formatters.js';

const props = defineProps({
  image: {
    type: Object,
    required: true
  }
});
</script>

<template>
  <div class="image-info">
    <div class="image-info__item">
      <strong>File:</strong> {{ image.name }}
    </div>
    <div class="image-info__item">
      <strong>Dimensions:</strong> {{ image.width }} × {{ image.height }}px
    </div>
    <div v-if="image.size" class="image-info__item">
      <strong>Size:</strong> {{ formatFileSize(image.size) }}
    </div>
    <div class="image-info__item">
      <strong>Ratio:</strong> {{ formatRatio(image.width / image.height) }}
    </div>
  </div>
</template>

<style scoped>
.image-info {
  display: grid;
  gap: 1rem;
  margin-top: 1.5rem;
  padding: 1rem;
  background: #f1f5f9;
  border-radius: 8px;
}

.image-info__item {
  font-size: 0.95rem;
  color: #2d3748;
}

.image-info__item strong {
  color: #1a202c;
}

@media (max-width: 768px) {
  .image-info {
    grid-template-columns: 1fr;
  }
}
</style>
