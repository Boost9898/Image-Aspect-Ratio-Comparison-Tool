<script setup>
const props = defineProps({
  focalPoint: Object
});

defineEmits([
  'update:focalPointX',
  'update:focalPointY',
  'resetFocalPoint'
]);
</script>

<template>
  <div>
    <h2>Preview Settings</h2>
    
    <div class="controls-grid">
      <!-- Focal Point Controls -->
      <div class="control-group focal-point-controls">
        <label>Focal Point</label>
        <div class="focal-inputs">
          <div class="focal-input">
            <label>X:</label>
            <input
              type="range"
              min="0"
              max="100"
              :value="focalPoint.x"
              @input="$emit('update:focalPointX', Number($event.target.value))"
              class="slider"
            />
            <span>{{ focalPoint.x }}%</span>
          </div>
          <div class="focal-input">
            <label>Y:</label>
            <input
              type="range"
              min="0"
              max="100"
              :value="focalPoint.y"
              @input="$emit('update:focalPointY', Number($event.target.value))"
              class="slider"
            />
            <span>{{ focalPoint.y }}%</span>
          </div>
        </div>
        <button @click="$emit('resetFocalPoint')" class="reset-btn">Reset to Center</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
h2 {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: #2d3748;
}

.controls-grid {
  display: grid;
  gap: 2rem;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.control-group label {
  font-weight: 600;
  color: #2d3748;
}

.slider {
  width: 100%;
  height: 8px;
  border-radius: 4px;
  background: #e2e8f0;
  outline: none;
  -webkit-appearance: none;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #667eea;
  cursor: pointer;
}

.slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #667eea;
  cursor: pointer;
  border: none;
}

.focal-inputs {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.focal-input {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.focal-input label {
  min-width: 20px;
  font-weight: 600;
}

.focal-input span {
  min-width: 40px;
  text-align: right;
  font-size: 0.9rem;
  color: #4a5568;
}

.reset-btn {
  padding: 0.5rem 1rem;
  background: #edf2f7;
  border: 2px solid #e2e8f0;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.reset-btn:hover {
  background: #e2e8f0;
  border-color: #cbd5e0;
}
</style>
