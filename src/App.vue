<script setup>
import ImageUpload from './components/ImageUpload.vue';
import ImageInfo from './components/ImageInfo.vue';
import AspectRatioSelector from './components/AspectRatioSelector.vue';
import OriginalPreview from './components/OriginalPreview.vue';
import PreviewGrid from './components/PreviewGrid.vue';

import { useImageStore } from './stores/imageStore.js';
import { useAspectRatioStore } from './stores/aspectRatioStore.js';
import { usePreviewStore } from './stores/previewStore.js';

// Initialize stores
const imageStore = useImageStore();
const aspectRatioStore = useAspectRatioStore();
const previewStore = usePreviewStore();
</script>

<template>
  <div class="app">
    <header class="header">
      <h1>Image Aspect Ratio Comparison</h1>
      <p>Compare how your image looks across different aspect ratios</p>
    </header>

    <main class="container">
      <!-- Image Upload and Original Preview Side by Side -->
      <div v-if="imageStore.image" class="two-column-layout">
        <!-- Left: Image Upload Section -->
        <section class="section">
          <h2>Upload image</h2>
          <ImageUpload />
          <ImageInfo :image="imageStore.image" />
        </section>

        <!-- Right: Original Preview with Focal Point -->
        <section class="section">
          <h2>Input image</h2>
          <OriginalPreview
            :image-url="imageStore.image.url"
            :image-name="imageStore.image.name"
            :display-mode="previewStore.displayMode"
            :focal-point="previewStore.focalPoint"
          />
        </section>
      </div>

      <!-- Image Upload Only (when no image loaded) -->
      <section v-else class="section">
        <ImageUpload />
      </section>

      <template v-if="imageStore.image">
        <!-- Aspect Ratio Selection -->
        <section class="section">
          <AspectRatioSelector />
        </section>

        <!-- Ratio Previews -->
        <section v-if="aspectRatioStore.selectedRatios.length > 0" class="section">
          <PreviewGrid
            :selected-ratios="aspectRatioStore.selectedRatios"
            :image-url="imageStore.image.url"
            :display-mode="previewStore.displayMode"
            :focal-point="previewStore.focalPoint"
            :get-image-style="previewStore.getImageStyle"
            :get-ratio-label="aspectRatioStore.getRatioLabel"
          />
        </section>

        <div v-else class="empty-state">
          <p>Select one or more aspect ratios above to see previews</p>
        </div>
      </template>
    </main>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 1rem;
}

.header {
  text-align: center;
  color: white;
  margin-top: 2rem;
  margin-bottom: 4rem;
}

.header h1 {
  font-size: 3rem;
  margin-bottom: 0.5rem;
  font-weight: 700;
}

.header p {
  opacity: 0.9;
  font-size: 1.1rem;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
}

.two-column-layout {
  display: grid;
  grid-template-columns: 2fr 3fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.section {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Standalone sections (not in two-column layout) */
.container > .section {
  margin-bottom: 1.5rem;
}

h2 {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: #2d3748;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #718096;
  font-size: 1.1rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

@media (max-width: 1024px) {
  .two-column-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .app {
    padding: 1rem 0.5rem;
  }
  
  .header h1 {
    font-size: 1.5rem;
  }
  
  .section {
    padding: 1.5rem;
  }
}
</style>
