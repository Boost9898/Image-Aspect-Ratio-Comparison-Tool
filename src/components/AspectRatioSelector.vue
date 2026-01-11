<script setup>
import { useAspectRatioStore, PRESET_RATIOS } from '../stores/aspectRatioStore.js';

const aspectRatioStore = useAspectRatioStore();
</script>

<template>
  <div>
    <h2>Select aspect ratios</h2>

    <!-- Preset Ratios -->
    <div class="ratio-presets">
      <label
        v-for="preset in PRESET_RATIOS"
        :key="preset.label"
        class="ratio-checkbox"
      >
        <input
          type="checkbox"
          :value="preset.value"
          :checked="aspectRatioStore.selectedRatios.includes(preset.value)"
          @change="aspectRatioStore.toggleRatio(preset.value)"
        />
        <span>{{ preset.label }}</span>
      </label>
    </div>

    <!-- Custom Ratio Input -->
    <div class="custom-ratio">
      <h3>Custom aspect ratio</h3>
      <div class="custom-ratio__input">
        <input
          type="text"
          v-model="aspectRatioStore.customRatioInput"
          placeholder="e.g., 3:2"
          @keyup.enter="aspectRatioStore.addCustomRatio"
        />
        <button 
          @click="aspectRatioStore.addCustomRatio" 
          :disabled="!aspectRatioStore.customRatioInput.trim()"
        >
          Add
        </button>
      </div>
      <div v-if="aspectRatioStore.customRatioError" class="error-message">
        {{ aspectRatioStore.customRatioError }}
      </div>
    </div>

    <!-- Custom Ratios List -->
    <div v-if="aspectRatioStore.customRatios.length > 0" class="custom-ratio-list">
      <div
        v-for="(ratio, index) in aspectRatioStore.customRatios"
        :key="index"
        class="custom-ratio-item"
      >
        <label class="ratio-checkbox">
          <input
            type="checkbox"
            :value="ratio.value"
            :checked="aspectRatioStore.selectedRatios.includes(ratio.value)"
            @change="aspectRatioStore.toggleRatio(ratio.value)"
          />
          <span>{{ ratio.label }}</span>
        </label>
        <button @click="aspectRatioStore.removeCustomRatio(index)" class="remove-btn">×</button>
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

h3 {
  font-size: 1.1rem;
  margin-bottom: 0.75rem;
  color: #4a5568;
}

.ratio-presets {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 0.75rem;
  margin-bottom: 2rem;
}

.ratio-checkbox {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  background: white;
  text-align: center;
}

.ratio-checkbox:hover {
  border-color: #667eea;
  background: #f1f5f9;
}

.ratio-checkbox input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
  flex-shrink: 0;
}

.ratio-checkbox span {
  flex: 1;
}

.ratio-checkbox input:checked + span {
  font-weight: 600;
  color: #667eea;
}

.custom-ratio__input {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.custom-ratio__input input {
  flex: 1;
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 6px;
  font-size: 1rem;
}

.custom-ratio__input input:focus {
  outline: none;
  border-color: #667eea;
}

.custom-ratio__input button {
  padding: 0.75rem 1.5rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.custom-ratio__input button:hover:not(:disabled) {
  background: #5a67d8;
}

.custom-ratio__input button:disabled {
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

.custom-ratio-list {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.custom-ratio-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.custom-ratio-item .ratio-checkbox {
  flex: 1;
  margin: 0;
}

.remove-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #feb2b2;
  color: #c53030;
  border: none;
  border-radius: 6px;
  font-size: 1.5rem;
  cursor: pointer;
  transition: background 0.2s;
  flex-shrink: 0;
}

.remove-btn:hover {
  background: #fc8181;
}

@media (max-width: 768px) {
  .ratio-presets {
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  }
}
</style>
