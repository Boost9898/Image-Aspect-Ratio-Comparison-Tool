# Image Aspect Ratio Comparison Tool
A Vue3 application for comparing how images look across different aspect ratios.

## Tech Stack
- **Vue 3** - Progressive JavaScript framework
- **Pinia** - Official state management library for Vue
- **Vite** - Front-end build tool
- **Composition API** - Modern Vue development pattern

## Features
- **File upload or URL input** - Load images from your local device or web
- **Drag & drop support** - Easy image selection
- **Preset aspect ratios + custom ratio support (W:H format)** - Comprehensive ratio options
- **Interactive focal point** - Click or drag on the image to control crop positioning
- **Fully responsive design** - Desktop and mobile
- **Pinia state management** - Robust and maintainable state management

## Setup
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure
```
src/
├── components/          # Vue components
│   ├── ImageUpload.vue       # File upload, drag-drop & URL input
│   ├── ImageInfo.vue         # Image metadata display
│   ├── AspectRatioSelector.vue  # Ratio selection UI
│   ├── OriginalPreview.vue   # Original image preview with interactive focal point
│   ├── PreviewGrid.vue       # Grid container for previews
│   └── PreviewCard.vue       # Individual ratio preview
├── stores/              # Pinia state management
│   ├── imageStore.js         # Image upload & URL loading
│   ├── aspectRatioStore.js   # Aspect ratio management
│   └── previewStore.js       # Focal point state
├── utils/              # Utility functions
│   └── formatters.js         # Format helpers
├── App.vue             # Root component
├── main.js             # Application entry
└── style.css           # Global styles
```

## State Management
The application uses **Pinia** for centralized state management:
- **imageStore**: Handles image upload, URL loading, validation, and storage
- **aspectRatioStore**: Manages preset and custom aspect ratios
- **previewStore**: Controls focal point for crop positioning


## Key Features Explained
### Image Loading
Load images in two ways:
1. **File Upload**: Drag & drop or click to select a file from your local device (JPEG, PNG, or WebP up to 50MB)
2. **URL Input**: Enter any image URL to load it directly

### Crop Preview
All previews show how your image will be cropped to fit each aspect ratio. The image fills the entire viewport for that ratio, with parts of the image cropped as needed.

### Interactive Focal Point Control
Control which part of the image stays centered when cropping:
- **Click** anywhere on the original image to set the focal point
- **Drag** the focal point indicator to adjust it precisely
- The focal point indicator shows exactly where the image is centered in all crop previews

### Custom Aspect Ratios
Add your own aspect ratios using W:H format.

### Real Dimensions Display
Each preview shows the actual pixel dimensions your cropped image would have, not just the preview container size. This helps you understand the final output size.

## Deployment
After building, deploy the `dist/` folder to any static hosting:
- Netlify
- Vercel
- GitHub Pages
- AWS S3
- Any web server