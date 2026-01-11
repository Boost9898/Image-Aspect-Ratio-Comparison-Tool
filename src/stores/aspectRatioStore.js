import { defineStore } from 'pinia';
import { ref } from 'vue';
import { parseCustomRatio, ratiosEqual, formatRatio } from '../utils/formatters.js';

export const PRESET_RATIOS = [
  { label: '1:1 (Square)', value: 1 },
  { label: '2:3 (Photo)', value: 2 / 3 },
  { label: '3:4 (Photo)', value: 3 / 4 },
  { label: '4:5 (Photo)', value: 4 / 5 },
  { label: '16:9 (Display)', value: 16 / 9 },
];

export const useAspectRatioStore = defineStore('aspectRatio', () => {
  const selectedRatios = ref([]);
  const customRatios = ref([]);
  const customRatioInput = ref('');
  const customRatioError = ref('');

  function toggleRatio(value) {
    const index = selectedRatios.value.findIndex(r => ratiosEqual(r, value));
    
    if (index > -1) {
      selectedRatios.value.splice(index, 1);
    } else {
      selectedRatios.value.push(value);
    }
  }

  function addCustomRatio() {
    customRatioError.value = '';
    
    const result = parseCustomRatio(customRatioInput.value);
    
    if (result.error) {
      customRatioError.value = result.error;
      return;
    }
    
    const ratioValue = result.value;
    
    // Check for duplicates
    const allRatios = [
      ...PRESET_RATIOS.map(p => p.value),
      ...customRatios.value.map(c => c.value)
    ];
    
    if (allRatios.some(r => ratiosEqual(r, ratioValue))) {
      customRatioError.value = 'This ratio already exists';
      return;
    }
    
    // Add custom ratio
    const label = `Custom ${formatRatio(ratioValue)}`;
    customRatios.value.push({ label, value: ratioValue });
    selectedRatios.value.push(ratioValue);
    customRatioInput.value = '';
  }

  function removeCustomRatio(index) {
    const ratio = customRatios.value[index];
    customRatios.value.splice(index, 1);
    selectedRatios.value = selectedRatios.value.filter(r => !ratiosEqual(r, ratio.value));
  }

  function getRatioLabel(ratio) {
    const preset = PRESET_RATIOS.find(p => ratiosEqual(p.value, ratio));
    if (preset) return preset.label;
    
    const custom = customRatios.value.find(c => ratiosEqual(c.value, ratio));
    if (custom) return custom.label;
    
    return formatRatio(ratio);
  }

  return {
    selectedRatios,
    customRatios,
    customRatioInput,
    customRatioError,
    toggleRatio,
    addCustomRatio,
    removeCustomRatio,
    getRatioLabel
  };
});
