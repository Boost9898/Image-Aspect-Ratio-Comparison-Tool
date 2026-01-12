<script setup>
import { ref } from 'vue';
import { useImageStore } from '../stores/imageStore.js';

const imageStore = useImageStore();
const fileInput = ref(null);
const imageUrl = ref('');

function loadFromUrl() {
  if (imageUrl.value.trim()) {
    imageStore.loadImageFromUrl(imageUrl.value.trim());
  }
}
</script>

<template>
  <div class="upload-wrapper">
    <!-- File Upload -->
    <div
      class="drop-zone"
      :class="{ 'drop-zone--dragover': imageStore.isDragging }"
      @drop.prevent="imageStore.handleDrop"
      @dragover.prevent="imageStore.setDragging(true)"
      @dragleave.prevent="imageStore.setDragging(false)"
    >
      <input
        type="file"
        id="file-input"
        accept="image/jpeg,image/png,image/webp"
        @change="imageStore.handleFileSelect"
        ref="fileInput"
      />
      <label for="file-input" class="drop-zone__label">
        <svg width="48" height="48" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
        </svg>
        <span v-if="!imageStore.image">Choose an image or drag it here</span>
        <span v-else>Change image</span>
        <span class="drop-zone__hint">JPEG, PNG, or WebP • Max 50MB</span>
      </label>
    </div>

    <!-- URL Input -->
    <div class="url-input-section">
      <div class="divider">
        <span>or</span>
      </div>
      <div class="url-input">
        <input
          type="url"
          v-model="imageUrl"
          placeholder="Enter image URL (https://example.com/image.jpg)"
          @keyup.enter="loadFromUrl"
          :disabled="imageStore.isLoadingUrl"
        />
        <button 
          @click="loadFromUrl" 
          :disabled="!imageUrl.trim() || imageStore.isLoadingUrl"
          class="url-button"
        >
          <span v-if="imageStore.isLoadingUrl">Loading...</span>
          <span v-else>Load</span>
        </button>
      </div>
    </div>

    <div v-if="imageStore.error" class="error-message">{{ imageStore.error }}</div>
  </div>
</template>

<style scoped>
.upload-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.drop-zone {
  border: 3px dashed #cbd5e0;
  border-radius: 8px;
  padding: 3rem 2rem;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
  background: #f7fafc;
}

.drop-zone:hover,
.drop-zone--dragover {
  border-color: #667eea;
  background: #edf2f7;
}

.drop-zone input[type="file"] {
  display: none;
}

.drop-zone__label {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  color: #4a5568;
}

.drop-zone__label svg {
  color: #667eea;
}

.drop-zone__label span:first-of-type {
  font-size: 1.1rem;
  font-weight: 600;
}

.drop-zone__hint {
  font-size: 0.9rem;
  color: #718096;
}

.url-input-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.divider {
  display: flex;
  align-items: center;
  text-align: center;
  color: #718096;
  font-size: 0.9rem;
  font-weight: 600;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #e2e8f0;
}

.divider span {
  padding: 0 1rem;
}

.url-input {
  display: flex;
  gap: 0.75rem;
}

.url-input input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.url-input input:focus {
  outline: none;
  border-color: #667eea;
}

.url-input input:disabled {
  background: #f7fafc;
  cursor: not-allowed;
}

.url-button {
  padding: 0.75rem 1.5rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  white-space: nowrap;
  min-width: 80px;
}

.url-button:hover:not(:disabled) {
  background: #5a67d8;
}

.url-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.error-message {
  background: #fed7d7;
  color: #c53030;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .drop-zone {
    padding: 2rem 1rem;
  }
  
  .url-input {
    flex-direction: column;
  }
  
  .url-button {
    width: 100%;
  }
}
</style>
