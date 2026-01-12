<script setup>
import { ref } from 'vue';
import PreviewCard from './PreviewCard.vue';
import { useImageStore } from '../stores/imageStore.js';
import { exportImage, generateExportFilename, exportCompositeImage } from '../utils/imageExport.js';

const props = defineProps({
  selectedRatios: Array,
  imageUrl: String,
  displayMode: String,
  focalPoint: Object,
  getImageStyle: Function,
  getRatioLabel: Function
});

const imageStore = useImageStore();
const isExportingAll = ref(false);
const isExportingComposite = ref(false);
const exportProgress = ref({ current: 0, total: 0 });

async function handleExportAll() {
  if (!imageStore.image || isExportingAll.value || props.selectedRatios.length === 0) return;
  
  isExportingAll.value = true;
  exportProgress.value = { current: 0, total: props.selectedRatios.length };
  
  try {
    for (let i = 0; i < props.selectedRatios.length; i++) {
      const ratio = props.selectedRatios[i];
      const ratioLabel = props.getRatioLabel(ratio);
      const filename = generateExportFilename(imageStore.image.name, ratioLabel);
      
      await exportImage(
        props.imageUrl,
        imageStore.image.width,
        imageStore.image.height,
        ratio,
        props.focalPoint,
        filename
      );
      
      exportProgress.value.current = i + 1;
      
      // Small delay between downloads to avoid browser blocking
      if (i < props.selectedRatios.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }
  } catch (error) {
    console.error('Export all failed:', error);
    alert('Failed to export some images. Please try again.');
  } finally {
    isExportingAll.value = false;
    exportProgress.value = { current: 0, total: 0 };
  }
}

async function handleExportComposite() {
  if (!imageStore.image || isExportingComposite.value || props.selectedRatios.length === 0) return;
  
  isExportingComposite.value = true;
  
  try {
    // Prepare ratios with labels
    const ratiosWithLabels = props.selectedRatios.map(ratio => ({
      ratio,
      label: props.getRatioLabel(ratio)
    }));
    
    // Generate filename
    const nameWithoutExt = imageStore.image.name.replace(/\.[^/.]+$/, '');
    const filename = `${nameWithoutExt}_comparison.png`;
    
    await exportCompositeImage(
      props.imageUrl,
      imageStore.image.width,
      imageStore.image.height,
      ratiosWithLabels,
      props.focalPoint,
      filename
    );
  } catch (error) {
    console.error('Export composite failed:', error);
    alert('Failed to export comparison image. Please try again.');
  } finally {
    isExportingComposite.value = false;
  }
}
</script>

<template>
  <div>
    <div class="preview-header">
      <h2>Aspect ratio previews ({{ selectedRatios.length }})</h2>
      <div v-if="selectedRatios.length > 0" class="button-group">
        <button 
          @click="handleExportComposite" 
          :disabled="isExportingComposite"
          class="download-composite-btn"
          title="Download comparison image with all ratios side by side"
        >
          <svg v-if="!isExportingComposite" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
          <span v-if="!isExportingComposite">Comparison</span>
          <span v-else class="spinner-text">Exporting...</span>
        </button>
        <button 
          @click="handleExportAll" 
          :disabled="isExportingAll"
          class="download-all-btn"
          title="Download all selected ratios"
        >
          <svg v-if="!isExportingAll" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          <span v-if="!isExportingAll">Download All</span>
          <span v-else class="progress-text">{{ exportProgress.current }}/{{ exportProgress.total }}</span>
        </button>
      </div>
    </div>
    
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
.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

h2 {
  font-size: 1.5rem;
  margin: 0;
  color: #2d3748;
}

.button-group {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.download-all-btn,
.download-composite-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.95rem;
}

.download-all-btn {
  background: #667eea;
}

.download-all-btn:hover:not(:disabled) {
  background: #5a67d8;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.download-composite-btn {
  background: #48bb78;
}

.download-composite-btn:hover:not(:disabled) {
  background: #38a169;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(72, 187, 120, 0.3);
}

.download-all-btn:disabled,
.download-composite-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.progress-text,
.spinner-text {
  font-variant-numeric: tabular-nums;
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
