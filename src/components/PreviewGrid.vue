<script setup>
import PreviewCard from './PreviewCard.vue';

const props = defineProps({
  selectedRatios: Array,
  imageUrl: String,
  displayMode: String,
  focalPoint: Object,
  getImageStyle: Function,
  getRatioLabel: Function
});
</script>

<template>
  <div>
    <h2>Aspect ratio previews ({{ selectedRatios.length }})</h2>
    
    <div class="previews-grid">
      <PreviewCard
        v-for="ratio in selectedRatios"
        :key="ratio"
        :ratio="ratio"
        :ratio-label="getRatioLabel(ratio)"
        :image-url="imageUrl"
        :display-mode="displayMode"
        :image-style="getImageStyle()"
        :focal-point="focalPoint"
      />
    </div>
  </div>
</template>

<style scoped>
h2 {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: #2d3748;
}

.previews-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

@media (max-width: 768px) {
  .previews-grid {
    grid-template-columns: 1fr;
  }
}
</style>
