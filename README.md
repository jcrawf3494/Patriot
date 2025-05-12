# Image Overlay Tool

A simple web application that allows users to upload a JPEG or PNG image and overlay a WebP image in the top left corner.

## Version Information

### Version 1.0.0 (Current)
- Initial release
- Features:
  - JPEG and PNG image upload support
  - WebP overlay in top left corner
  - PNG output with transparency preservation
  - Modern responsive UI
  - Complete reference numbering system (refNum1-refNum10)
- File Structure:
  - `index.html` - Main webpage with refNum1-refNum8 elements
  - `styles.css` - Styling with refNum1-refNum10 rules
  - `script.js` - Image processing logic with refNum1-refNum9 functions
  - `patriotLogo.webp` - Overlay image

## Features

- Upload JPEG or PNG images
- Automatic overlay of the WebP image in the top left corner
- Download the resulting image as PNG (preserves transparency)
- Modern and responsive design

## How to Use

1. Open `index.html` in a web browser
2. Click the "Choose Image" button to select your JPEG or PNG image
3. The image will be displayed with the overlay in the top left corner
4. Click the "Download Image" button to save the result

## Requirements

- A modern web browser that supports HTML5 Canvas
- The `patriotLogo.webp` file must be in the same directory as `index.html`

## Technical Details

The application uses:
- HTML5 Canvas for image processing
- Vanilla JavaScript for functionality
- CSS3 for styling

## File Structure

- `index.html` - Main webpage
- `styles.css` - Styling
- `script.js` - Image processing logic
- `patriotLogo.webp` - Overlay image 