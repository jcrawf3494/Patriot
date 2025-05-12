document.addEventListener('DOMContentLoaded', () => {
    // refNum1. DOM Elements
    const imageUpload = document.getElementById('imageUpload');      // Reference refNum4
    const canvas = document.getElementById('imageCanvas');          // Reference refNum7
    const ctx = canvas.getContext('2d');
    const downloadBtn = document.getElementById('downloadBtn');     // Reference refNum8
    const topText = document.getElementById('topText');             // Top text input reference
    const bottomText = document.getElementById('bottomText');       // Bottom text input reference
    const increaseTopFont = document.getElementById('increaseTopFont');
    const decreaseTopFont = document.getElementById('decreaseTopFont');
    const increaseBottomFont = document.getElementById('increaseBottomFont');
    const decreaseBottomFont = document.getElementById('decreaseBottomFont');
    
    // Font size state
    let topFontSize = 48;
    let bottomFontSize = 48;
    const MIN_FONT_SIZE = 12;
    const MAX_FONT_SIZE = 120;
    const FONT_SIZE_STEP = 4;
    
    // Dragging state
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let textX = 0;
    let textY = 0;
    let isDraggingTopText = false;
    
    // refNum2. Overlay Image
    let overlayImage = new Image();
    overlayImage.src = 'patriotLogo.webp';
    let logoWidth = 0;
    
    // Wait for logo to load to get its width
    overlayImage.onload = function() {
        logoWidth = overlayImage.width;
        // Initialize text position after logo
        textX = logoWidth + 15;
        textY = 65;
    };
    
    // refNum3. Event Listeners
    imageUpload.addEventListener('change', handleImageUpload);      // Reference refNum4
    downloadBtn.addEventListener('click', downloadImage);          // Reference refNum8
    topText.addEventListener('input', redrawCanvas);               // Top text input listener
    bottomText.addEventListener('input', redrawCanvas);            // Bottom text input listener
    
    // Font size control event listeners
    increaseTopFont.addEventListener('click', () => {
        if (topFontSize < MAX_FONT_SIZE) {
            topFontSize += FONT_SIZE_STEP;
            redrawCanvas();
        }
    });
    
    decreaseTopFont.addEventListener('click', () => {
        if (topFontSize > MIN_FONT_SIZE) {
            topFontSize -= FONT_SIZE_STEP;
            redrawCanvas();
        }
    });
    
    increaseBottomFont.addEventListener('click', () => {
        if (bottomFontSize < MAX_FONT_SIZE) {
            bottomFontSize += FONT_SIZE_STEP;
            redrawCanvas();
        }
    });
    
    decreaseBottomFont.addEventListener('click', () => {
        if (bottomFontSize > MIN_FONT_SIZE) {
            bottomFontSize -= FONT_SIZE_STEP;
            redrawCanvas();
        }
    });
    
    // Canvas mouse events for dragging text
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseUp);
    
    function handleMouseDown(e) {
        if (!topText.value) return;
        
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        // Check if click is within text bounds
        const textWidth = ctx.measureText(topText.value.toUpperCase()).width;
        const textHeight = topFontSize; // Use current font size
        
        if (mouseX >= textX && mouseX <= textX + textWidth &&
            mouseY >= textY - textHeight && mouseY <= textY) {
            isDragging = true;
            isDraggingTopText = true;
            dragStartX = mouseX - textX;
            dragStartY = mouseY - textY;
        }
    }
    
    function handleMouseMove(e) {
        if (!isDragging || !isDraggingTopText) return;
        
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        textX = mouseX - dragStartX;
        textY = mouseY - dragStartY;
        
        // Keep text within canvas bounds
        textX = Math.max(0, Math.min(textX, canvas.width - ctx.measureText(topText.value.toUpperCase()).width));
        textY = Math.max(topFontSize, Math.min(textY, canvas.height - 20));
        
        redrawCanvas();
    }
    
    function handleMouseUp() {
        isDragging = false;
        isDraggingTopText = false;
    }
    
    // Function to draw text with glow effect
    function drawTextWithGlow(text, x, y, isTopText = false) {
        // Convert text to uppercase
        text = text.toUpperCase();
        
        // Calculate maximum width based on available space
        const maxWidth = isTopText ? 
            canvas.width - x - 20 : // For top text: available space from x to right edge minus padding
            canvas.width * 0.9;     // For bottom text: 90% of canvas width
        
        // Use the appropriate font size
        let fontSize = isTopText ? topFontSize : bottomFontSize;
        ctx.font = `${fontSize}px Impact`;
        
        // Reduce font size until text fits within maxWidth
        while (ctx.measureText(text).width > maxWidth && fontSize > MIN_FONT_SIZE) {
            fontSize -= 2;
            ctx.font = `${fontSize}px Impact`;
            // Update the stored font size
            if (isTopText) {
                topFontSize = fontSize;
            } else {
                bottomFontSize = fontSize;
            }
        }
        
        // Set text properties
        ctx.textAlign = isTopText ? 'left' : 'center';
        
        // Draw glow effect
        if (isTopText) {
            ctx.shadowColor = '#0044cc'; // Dark electric blue color
            ctx.shadowBlur = 25;         // Increased blur for brighter glow
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            
            // Draw multiple layers of glow for more intensity
            ctx.fillStyle = '#0044cc';
            ctx.fillText(text, x, y);
            ctx.fillText(text, x, y);
        } else {
            ctx.shadowColor = '#ff0000';
            ctx.shadowBlur = 15;
        }
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        
        // Draw text
        ctx.fillStyle = 'white';
        if (isTopText) {
            // Draw stroke first
            ctx.strokeStyle = '#0044cc';
            ctx.lineWidth = 1;
            ctx.strokeText(text, x, y);
        }
        ctx.fillText(text, x, y);
        
        // Reset shadow
        ctx.shadowBlur = 0;
    }
    
    // Function to draw gradient rectangle
    function drawGradientRectangle() {
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');    // White at start
        gradient.addColorStop(0.6, 'rgba(255, 255, 255, 1)');  // Stay white until 60% across
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');    // Fade to transparent at end
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, 120);  // Back to 120px height
    }
    
    // Function to redraw canvas with current state
    function redrawCanvas() {
        if (!canvas.width || !canvas.height) return;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Redraw base image if it exists
        if (baseImage) {
            ctx.drawImage(baseImage, 0, 0);
        }
        
        // Draw gradient rectangle
        drawGradientRectangle();
        
        // Draw overlay
        ctx.drawImage(overlayImage, 5, 5);  // Moved 5px right and 5px down
        
        // Draw top text if it exists
        if (topText.value) {
            drawTextWithGlow(topText.value, textX, textY, true);
        }
        
        // Draw bottom text if it exists
        if (bottomText.value) {
            const bottomPadding = 20;
            drawTextWithGlow(bottomText.value, canvas.width / 2, canvas.height - bottomPadding, false);
        }
    }
    
    let baseImage = null;
    
    // refNum4. Image Upload Handler
    function handleImageUpload(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(event) {
            const img = new Image();
            img.onload = function() {
                // refNum5. Canvas Setup
                canvas.width = img.width;                          // Reference refNum7
                canvas.height = img.height;
                
                // Store base image
                baseImage = img;
                
                // Reset text position and font sizes
                textX = logoWidth + 15;
                textY = 65;
                topFontSize = 48;
                bottomFontSize = 48;
                
                // Redraw canvas with new image
                redrawCanvas();
                
                // refNum8. Enable Download
                downloadBtn.disabled = false;                      // Reference refNum8
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }
    
    // refNum9. Download Handler
    function downloadImage() {
        const link = document.createElement('a');
        link.download = 'overlayed-image.png';
        link.href = canvas.toDataURL('image/png');                // Reference refNum7
        link.click();
    }
}); 