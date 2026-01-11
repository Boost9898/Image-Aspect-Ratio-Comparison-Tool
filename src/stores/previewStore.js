import { defineStore } from 'pinia';
import { ref } from 'vue';

export const usePreviewStore = defineStore('preview', () => {
  const displayMode = ref('cover'); // Always cover mode
  const focalPoint = ref({ x: 50, y: 50 });

  function resetFocalPoint() {
    focalPoint.value = { x: 50, y: 50 };
  }

  function setFocalPointX(value) {
    focalPoint.value.x = value;
  }

  function setFocalPointY(value) {
    focalPoint.value.y = value;
  }

  function getImageStyle() {
    // Always use cover mode with focal point positioning
    return {
      objectFit: 'cover',
      objectPosition: `${focalPoint.value.x}% ${focalPoint.value.y}%`
    };
  }

  return {
    displayMode,
    focalPoint,
    resetFocalPoint,
    setFocalPointX,
    setFocalPointY,
    getImageStyle
  };
});
