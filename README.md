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
- **Crop box overlays** - See each selected ratio outlined on the original image
- **Crop box toggle** - Show/hide overlays from the footer under the input image
- **Per-ratio export** - Download a cropped image for any ratio
- **Batch export** - Download all selected ratios at once
- **Comparison export** - Generate a side-by-side composite image of all ratios
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
│   ├── AspectRatioSelector.vue  # Ratio selection UI
│   ├── ImageInfo.vue         # Image metadata display
│   ├── ImageUpload.vue       # File upload, drag-drop & URL input
│   ├── OriginalPreview.vue   # Original image preview with interactive focal point
│   ├── PreviewCard.vue       # Individual ratio preview
│   ├── PreviewControls.vue   # Individual ratio controls
│   └── PreviewGrid.vue       # Grid container for previews
├── stores/              # Pinia state management
│   ├── imageStore.js         # Image upload & URL loading
│   ├── aspectRatioStore.js   # Aspect ratio management
│   └── previewStore.js       # Focal point state
├── utils/              # Utility functions
│   ├── formatters.js         # Format helpers
│   └── imageExport.js        # Crop + export helpers
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
You can also see crop boxes for each selected ratio drawn over the original image, and toggle them off for a cleaner view.

### Interactive Focal Point Control
Control which part of the image stays centered when cropping:
- **Click** anywhere on the original image to set the focal point
- **Drag** the focal point indicator to adjust it precisely
- The focal point indicator shows where the crop is biased within each ratio (matching preview/export positioning)

### Custom Aspect Ratios
Add your own aspect ratios using W:H format.

### Real Dimensions Display
Each preview shows the actual pixel dimensions your cropped image would have, not just the preview container size. This helps you understand the final output size.

### Exporting Images
Use the download buttons above the previews to:
- Export a single ratio
- Download all selected ratios
- Generate a side-by-side comparison image

Note: exports for some remote URLs may fail if the host blocks cross-origin canvas access (CORS).

## Deployment
After building, deploy the `dist/` folder to any static hosting:
- Netlify
- Vercel
- GitHub Pages
- AWS S3
- Any web server

### GitHub Pages (docs folder)
If you deploy via GitHub Pages with the `/docs` folder setting:
1. Run `npm run build` to generate `dist/`.
2. Move or copy the contents of `dist/` into `/docs`.
3. Commit and push `/docs` so GitHub Pages can publish it.
