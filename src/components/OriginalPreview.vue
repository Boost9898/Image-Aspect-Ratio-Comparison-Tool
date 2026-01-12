<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { usePreviewStore } from '../stores/previewStore.js';
import { useAspectRatioStore } from '../stores/aspectRatioStore.js';
import { formatRatio } from '../utils/formatters.js';

const props = defineProps({
  imageUrl: {
    type: String,
    required: true
  },
  imageName: {
    type: String,
    required: true
  },
  displayMode: {
    type: String,
    default: 'cover'
  },
  focalPoint: {
    type: Object,
    default: () => ({ x: 50, y: 50 })
  }
});

const previewStore = usePreviewStore();
const aspectRatioStore = useAspectRatioStore();
const previewContainer = ref(null);
const imageElement = ref(null);
const imageBounds = ref(null);
const isDragging = ref(false);
const showCropBoxes = ref(true);

const cropBoxColors = [
  { border: '#667eea', fill: 'rgba(102, 126, 234, 0.3)' },
  { border: '#48bb78', fill: 'rgba(72, 187, 120, 0.3)' },
  { border: '#ed8936', fill: 'rgba(237, 137, 54, 0.3)' },
  { border: '#f56565', fill: 'rgba(245, 101, 101, 0.3)' },
  { border: '#4299e1', fill: 'rgba(66, 153, 225, 0.3)' },
  { border: '#9f7aea', fill: 'rgba(159, 122, 234, 0.3)' }
];

// Calculate the actual rendered image bounds within the container
const calculateImageBounds = () => {
  if (!imageElement.value || !previewContainer.value) return;
  
  const img = imageElement.value;
  const container = previewContainer.value;
  
  const containerRect = container.getBoundingClientRect();
  const imgRect = img.getBoundingClientRect();
  
  // Calculate the actual image position relative to container
  imageBounds.value = {
    left: imgRect.left - containerRect.left,
    top: imgRect.top - containerRect.top,
    width: imgRect.width,
    height: imgRect.height
  };
};

// Convert focal point percentage to pixel position
const focalIndicatorStyle = computed(() => {
  if (!imageBounds.value) return {};
  
  const x = imageBounds.value.left + (props.focalPoint.x / 100) * imageBounds.value.width;
  const y = imageBounds.value.top + (props.focalPoint.y / 100) * imageBounds.value.height;
  
  return {
    left: `${x}px`,
    top: `${y}px`
  };
});

const cropBoxes = computed(() => {
  if (!showCropBoxes.value || !imageBounds.value) return [];

  const ratios = aspectRatioStore.selectedRatios;
  if (!ratios.length) return [];

  const { left, top, width, height } = imageBounds.value;
  const imageRatio = width / height;
  const focalX = Math.min(100, Math.max(0, props.focalPoint.x));
  const focalY = Math.min(100, Math.max(0, props.focalPoint.y));

  return ratios.map((ratio, index) => {
    let boxWidth;
    let boxHeight;
    let offsetX = 0;
    let offsetY = 0;

    if (imageRatio > ratio) {
      boxHeight = height;
      boxWidth = height * ratio;
      const maxOffset = width - boxWidth;
      offsetX = (focalX / 100) * maxOffset;
    } else {
      boxWidth = width;
      boxHeight = width / ratio;
      const maxOffset = height - boxHeight;
      offsetY = (focalY / 100) * maxOffset;
    }

    const colors = cropBoxColors[index % cropBoxColors.length];

    return {
      ratio,
      label: formatRatio(ratio),
      left: left + offsetX,
      top: top + offsetY,
      width: boxWidth,
      height: boxHeight,
      color: colors.border,
      fill: colors.fill
    };
  });
});

// Handle click on image to set focal point
const handleClick = (event) => {
  if (!imageBounds.value || isDragging.value) return;
  
  const container = previewContainer.value;
  const rect = container.getBoundingClientRect();
  
  const clickX = event.clientX - rect.left;
  const clickY = event.clientY - rect.top;
  
  // Check if click is within image bounds
  if (
    clickX >= imageBounds.value.left &&
    clickX <= imageBounds.value.left + imageBounds.value.width &&
    clickY >= imageBounds.value.top &&
    clickY <= imageBounds.value.top + imageBounds.value.height
  ) {
    // Convert to percentage relative to image
    const x = ((clickX - imageBounds.value.left) / imageBounds.value.width) * 100;
    const y = ((clickY - imageBounds.value.top) / imageBounds.value.height) * 100;
    
    previewStore.setFocalPointX(Math.round(x));
    previewStore.setFocalPointY(Math.round(y));
  }
};

// Handle mouse down on container (for potential dragging)
const handleMouseDown = (event) => {
  // Only handle if clicking on the image itself, not the focal point
  if (event.target === imageElement.value) {
    handleClick(event);
  }
};

// Start dragging the focal point
const startDragging = (event) => {
  event.preventDefault();
  isDragging.value = true;
  
  document.addEventListener('mousemove', onDrag);
  document.addEventListener('mouseup', stopDragging);
};

// Handle dragging
const onDrag = (event) => {
  if (!isDragging.value || !imageBounds.value || !previewContainer.value) return;
  
  const container = previewContainer.value;
  const rect = container.getBoundingClientRect();
  
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;
  
  // Constrain to image bounds
  const constrainedX = Math.max(
    imageBounds.value.left,
    Math.min(mouseX, imageBounds.value.left + imageBounds.value.width)
  );
  const constrainedY = Math.max(
    imageBounds.value.top,
    Math.min(mouseY, imageBounds.value.top + imageBounds.value.height)
  );
  
  // Convert to percentage relative to image
  const x = ((constrainedX - imageBounds.value.left) / imageBounds.value.width) * 100;
  const y = ((constrainedY - imageBounds.value.top) / imageBounds.value.height) * 100;
  
  previewStore.setFocalPointX(Math.round(x));
  previewStore.setFocalPointY(Math.round(y));
};

// Stop dragging
const stopDragging = () => {
  isDragging.value = false;
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', stopDragging);
};

// Recalculate bounds on window resize
const handleResize = () => {
  calculateImageBounds();
};

onMounted(() => {
  window.addEventListener('resize', handleResize);
  // Initial calculation after mount
  setTimeout(calculateImageBounds, 100);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', stopDragging);
});
</script>

<template>
  <div class="original-preview-wrapper">
    <div 
      class="original-preview"
      ref="previewContainer"
      @click="handleClick"
      @mousedown="handleMouseDown"
    >
      <img 
        ref="imageElement"
        :src="imageUrl" 
        :alt="imageName"
        @load="calculateImageBounds"
      />

      <!-- Crop boxes for selected ratios -->
      <div
        v-for="(box, index) in cropBoxes"
        :key="`${box.ratio}-${index}`"
        class="crop-box"
        :style="{
          left: `${box.left}px`,
          top: `${box.top}px`,
          width: `${box.width}px`,
          height: `${box.height}px`,
          '--box-color': box.color,
          '--box-fill': box.fill
        }"
      >
        <span class="crop-box__label">{{ box.label }}</span>
      </div>
      
      <!-- Focal point indicator -->
      <div
        v-if="imageBounds"
        class="focal-indicator"
        :style="focalIndicatorStyle"
        @mousedown.stop="startDragging"
      >
        <div class="focal-indicator__dot"></div>
        <div class="focal-indicator__label">Focal Point</div>
      </div>
    </div>
    <div class="preview-footer">
      <p class="focal-hint">
        Click or drag the focal point to set where the cropped image should focus on.
      </p>
      <button
        type="button"
        class="crop-toggle"
        :aria-pressed="showCropBoxes"
        :title="showCropBoxes ? 'Hide crop boxes' : 'Show crop boxes'"
        @click="showCropBoxes = !showCropBoxes"
      >
        <svg
          v-if="showCropBoxes"
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"></path>
          <circle cx="12" cy="12" r="3"></circle>
          <line x1="3" y1="3" x2="21" y2="21"></line>
        </svg>
        <span>{{ showCropBoxes ? 'Hide crop boxes' : 'Show crop boxes' }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.original-preview-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.original-preview {
  position: relative;
  display: flex;
  justify-content: center;
  padding: 1rem;
  background: #f1f5f9;
  border-radius: 8px;
  cursor: crosshair;
}

.original-preview img {
  max-width: 100%;
  max-height: 500px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: block;
  user-select: none;
}

.crop-box {
  position: absolute;
  border: 2px dashed var(--box-color);
  background: var(--box-fill);
  border-radius: 6px;
  box-sizing: border-box;
  pointer-events: none;
  z-index: 5;
}

.crop-box__label {
  position: absolute;
  top: 6px;
  left: 6px;
  padding: 2px 6px;
  border-radius: 4px;
  background: var(--box-color);
  color: white;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  pointer-events: none;
}

.focal-indicator {
  position: absolute;
  transform: translate(-50%, -50%);
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  cursor: move;
}

.focal-indicator__dot {
  width: 24px;
  height: 24px;
  background: rgba(102, 126, 234, 0.9);
  border: 4px solid white;
  border-radius: 50%;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.4);
  transition: transform 0.2s ease;
}

.focal-indicator:hover .focal-indicator__dot {
  transform: scale(1.2);
}

.focal-indicator:active .focal-indicator__dot {
  transform: scale(1.1);
  background: rgba(102, 126, 234, 1);
}

.focal-indicator__label {
  background: rgba(102, 126, 234, 0.95);
  color: white;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  pointer-events: none;
}

.preview-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.focal-hint {
  flex: 1;
  text-align: left;
  color: #718096;
  font-size: 0.9rem;
  font-style: italic;
}

.crop-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.6rem;
  border: 1px solid #e2e8f0;
  border-radius: 999px;
  background: white;
  color: #2d3748;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.crop-toggle:hover {
  background: #f7fafc;
}
</style>
