/**
 * Format file size in bytes to human-readable format
 */
export function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

/**
 * Format aspect ratio as a simple fraction
 */
export function formatRatio(ratio) {
  const tolerance = 0.001;
  const maxDenominator = 100;
  
  for (let denom = 1; denom <= maxDenominator; denom++) {
    const numer = Math.round(ratio * denom);
    if (Math.abs(ratio - numer / denom) < tolerance) {
      return `${numer}:${denom}`;
    }
  }
  
  return ratio.toFixed(2);
}

/**
 * Parse custom ratio input (supports "W:H" format only)
 */
export function parseCustomRatio(input) {
  const trimmed = input.trim();
  
  if (!trimmed) {
    return { error: 'Please enter a ratio' };
  }
  
  // Parse W:H format
  if (trimmed.includes(':')) {
    const parts = trimmed.split(':').map(p => parseFloat(p.trim()));
    if (parts.length !== 2 || parts.some(p => isNaN(p) || p <= 0)) {
      return { error: 'Invalid ratio format. Use W:H (2:3)' };
    }
    return { value: parts[0] / parts[1] };
  }

  return { error: 'Invalid ratio format. Use W:H (2:3)' };
}

/**
 * Check if two ratios are approximately equal
 */
export function ratiosEqual(ratio1, ratio2, tolerance = 0.001) {
  return Math.abs(ratio1 - ratio2) < tolerance;
}
