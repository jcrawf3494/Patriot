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
    const comingSoonBtn = document.getElementById('comingSoonBtn');
    const increaseComingSoonFont = document.getElementById('increaseComingSoonFont');
    const decreaseComingSoonFont = document.getElementById('decreaseComingSoonFont');
    const addSnowModeBtn = document.getElementById('addSnowModeBtn');
    const increaseSnowModeSize = document.getElementById('increaseSnowModeSize');
    const decreaseSnowModeSize = document.getElementById('decreaseSnowModeSize');
    const removeSnowModeBtn = document.getElementById('removeSnowModeBtn');
    const addGreatReliabilityBtn = document.getElementById('addGreatReliabilityBtn');
    const increaseGreatReliabilitySize = document.getElementById('increaseGreatReliabilitySize');
    const decreaseGreatReliabilitySize = document.getElementById('decreaseGreatReliabilitySize');
    const removeGreatReliabilityBtn = document.getElementById('removeGreatReliabilityBtn');
    const addGreatGasMileageBtn = document.getElementById('addGreatGasMileageBtn');
    const increaseGreatGasMileageSize = document.getElementById('increaseGreatGasMileageSize');
    const decreaseGreatGasMileageSize = document.getElementById('decreaseGreatGasMileageSize');
    const removeGreatGasMileageBtn = document.getElementById('removeGreatGasMileageBtn');
    
    // Font size state
    let topFontSize = 48;
    let bottomFontSize = 48;
    let comingSoonFontSize = 60;
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
    
    // Coming Soon text state
    let showComingSoon = false;
    const MIN_SCALE = 0.1;
    const MAX_SCALE = 2.0;
    const MAX_GREAT_GAS_MILEAGE_SCALE = 1.0;
    const SCALE_STEP = 0.05;
    
    // Snow Mode SVG state
    let snowModeImage = null;
    let showSnowMode = false;
    let snowModeX = 0;
    let snowModeY = 0;
    let snowModeWidth = 0;
    let snowModeHeight = 0;
    let snowModeScale = 0.3; // Start at 30% of original size
    let isDraggingSnowMode = false;
    
    // Great Reliability image state
    let greatReliabilityImage = null;
    let showGreatReliability = false;
    let greatReliabilityX = 0;
    let greatReliabilityY = 0;
    let greatReliabilityWidth = 0;
    let greatReliabilityHeight = 0;
    let greatReliabilityScale = 0.3; // Start at 30% of original size
    let isDraggingGreatReliability = false;

    // Great Gas Mileage image state
    let greatGasMileageImage = null;
    let showGreatGasMileage = false;
    let greatGasMileageX = 0;
    let greatGasMileageY = 0;
    let greatGasMileageWidth = 0;
    let greatGasMileageHeight = 0;
    let greatGasMileageScale = 0.3;
    let isDraggingGreatGasMileage = false;
    
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
        if (baseImage) redrawCanvas();
    };
    
    // Local-only file import: file picker and external drag-and-drop share one loader.
    const canvasStage = document.getElementById('canvasDropZone');
    const dropZone = document.getElementById('dropZone');
    const fileName = document.getElementById('fileName');
    const previewStatus = document.getElementById('previewStatus');
    const allowedExtensions = /\\.(jpe?g|png|webp)$/i;

    function isSupportedImage(file) {
        return !!file && (
            ['image/jpeg', 'image/png', 'image/webp'].includes(file.type) ||
            (!file.type && allowedExtensions.test(file.name))
        );
    }

    function acceptFiles(files) {
        const file = Array.from(files || []).find(isSupportedImage);
        if (!file) {
            alert('Choose a JPG, PNG, or WebP photo.');
            return;
        }
        handleImageFile(file);
    }

    // Drop anywhere on the page, with a visible target in the upload panel and canvas.
    // Do not intercept drag events originating from the canvas editing tools.
    let externalDragDepth = 0;
    function isFileDrag(event) {
        return Array.from(event.dataTransfer?.types || []).includes('Files');
    }
    document.addEventListener('dragenter', (event) => {
        if (!isFileDrag(event)) return;
        event.preventDefault();
        externalDragDepth += 1;
        dropZone.classList.add('is-dragover');
        canvasStage.classList.add('is-dragover');
    });
    document.addEventListener('dragover', (event) => {
        if (!isFileDrag(event)) return;
        event.preventDefault();
        if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy';
    });
    document.addEventListener('dragleave', (event) => {
        if (!isFileDrag(event)) return;
        externalDragDepth = Math.max(0, externalDragDepth - 1);
        if (!externalDragDepth) clearDropState();
    });
    function clearDropState() {
        externalDragDepth = 0;
        dropZone.classList.remove('is-dragover');
        canvasStage.classList.remove('is-dragover');
    }
    document.addEventListener('drop', (event) => {
        if (!isFileDrag(event)) return;
        event.preventDefault();
        clearDropState();
        acceptFiles(event.dataTransfer.files);
    });
    dropZone.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            imageUpload.click();
        }
    });

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
    
    // Coming Soon button event listener
    comingSoonBtn.addEventListener('click', addComingSoonText);
    
    // Snow Mode button event listener
    addSnowModeBtn.addEventListener('click', addSnowModeOverlay);
    
    // Snow Mode remove button event listener
    removeSnowModeBtn.addEventListener('click', removeSnowModeOverlay);
    
    // Great Reliability button event listener
    addGreatReliabilityBtn.addEventListener('click', addGreatReliabilityBadge);
    
    // Great Reliability remove button event listener
    removeGreatReliabilityBtn.addEventListener('click', removeGreatReliabilityBadge);

    // Great Gas Mileage button event listeners
    addGreatGasMileageBtn.addEventListener('click', addGreatGasMileageBadge);
    removeGreatGasMileageBtn.addEventListener('click', removeGreatGasMileageBadge);
    
    // Snow Mode size control event listeners
    increaseSnowModeSize.addEventListener('click', () => {
        if (snowModeScale < MAX_SCALE && showSnowMode && snowModeImage) {
            // Store current center position
            const centerX = snowModeX + snowModeWidth / 2;
            const centerY = snowModeY + snowModeHeight / 2;
            
            snowModeScale = Math.min(MAX_SCALE, snowModeScale + SCALE_STEP);
            updateSnowModeDimensions();
            
            // Restore center position
            snowModeX = centerX - snowModeWidth / 2;
            snowModeY = centerY - snowModeHeight / 2;
            
            redrawCanvas();
        }
    });
    
    decreaseSnowModeSize.addEventListener('click', () => {
        if (snowModeScale > MIN_SCALE && showSnowMode && snowModeImage) {
            // Store current center position
            const centerX = snowModeX + snowModeWidth / 2;
            const centerY = snowModeY + snowModeHeight / 2;
            
            snowModeScale = Math.max(MIN_SCALE, snowModeScale - SCALE_STEP);
            updateSnowModeDimensions();
            
            // Restore center position
            snowModeX = centerX - snowModeWidth / 2;
            snowModeY = centerY - snowModeHeight / 2;
            
            redrawCanvas();
        }
    });
    
    // Great Reliability size control event listeners
    increaseGreatReliabilitySize.addEventListener('click', () => {
        if (greatReliabilityScale < MAX_SCALE && showGreatReliability && greatReliabilityImage) {
            // Store current center position
            const centerX = greatReliabilityX + greatReliabilityWidth / 2;
            const centerY = greatReliabilityY + greatReliabilityHeight / 2;
            
            greatReliabilityScale = Math.min(MAX_SCALE, greatReliabilityScale + SCALE_STEP);
            updateGreatReliabilityDimensions();
            
            // Restore center position
            greatReliabilityX = centerX - greatReliabilityWidth / 2;
            greatReliabilityY = centerY - greatReliabilityHeight / 2;
            
            redrawCanvas();
        }
    });
    
    decreaseGreatReliabilitySize.addEventListener('click', () => {
        if (greatReliabilityScale > MIN_SCALE && showGreatReliability && greatReliabilityImage) {
            // Store current center position
            const centerX = greatReliabilityX + greatReliabilityWidth / 2;
            const centerY = greatReliabilityY + greatReliabilityHeight / 2;
            
            greatReliabilityScale = Math.max(MIN_SCALE, greatReliabilityScale - SCALE_STEP);
            updateGreatReliabilityDimensions();
            
            // Restore center position
            greatReliabilityX = centerX - greatReliabilityWidth / 2;
            greatReliabilityY = centerY - greatReliabilityHeight / 2;
            
            redrawCanvas();
        }
    });

    // Great Gas Mileage size control event listeners
    increaseGreatGasMileageSize.addEventListener('click', () => {
        if (greatGasMileageScale < MAX_GREAT_GAS_MILEAGE_SCALE && showGreatGasMileage && greatGasMileageImage) {
            const centerX = greatGasMileageX + greatGasMileageWidth / 2;
            const centerY = greatGasMileageY + greatGasMileageHeight / 2;

            greatGasMileageScale = Math.min(MAX_GREAT_GAS_MILEAGE_SCALE, greatGasMileageScale + SCALE_STEP);
            updateGreatGasMileageDimensions();
            greatGasMileageX = centerX - greatGasMileageWidth / 2;
            greatGasMileageY = centerY - greatGasMileageHeight / 2;
            redrawCanvas();
        }
    });

    decreaseGreatGasMileageSize.addEventListener('click', () => {
        if (greatGasMileageScale > MIN_SCALE && showGreatGasMileage && greatGasMileageImage) {
            const centerX = greatGasMileageX + greatGasMileageWidth / 2;
            const centerY = greatGasMileageY + greatGasMileageHeight / 2;

            greatGasMileageScale = Math.max(MIN_SCALE, greatGasMileageScale - SCALE_STEP);
            updateGreatGasMileageDimensions();
            greatGasMileageX = centerX - greatGasMileageWidth / 2;
            greatGasMileageY = centerY - greatGasMileageHeight / 2;
            redrawCanvas();
        }
    });
    
    // Coming Soon font size control event listeners
    increaseComingSoonFont.addEventListener('click', () => {
        if (comingSoonFontSize < MAX_FONT_SIZE) {
            comingSoonFontSize += FONT_SIZE_STEP;
            redrawCanvas();
        }
    });
    
    decreaseComingSoonFont.addEventListener('click', () => {
        if (comingSoonFontSize > MIN_FONT_SIZE) {
            comingSoonFontSize -= FONT_SIZE_STEP;
            redrawCanvas();
        }
    });
    
    // Pointer events support mouse, touch and pen while preserving existing drag logic.
    canvas.addEventListener('pointerdown', (event) => {
        if (!baseImage || (event.button !== 0 && event.pointerType === 'mouse')) return;
        handleMouseDown(event);
        if (isDragging) {
            canvas.setPointerCapture(event.pointerId);
            event.preventDefault();
        }
    });
    canvas.addEventListener('pointermove', handleMouseMove);
    canvas.addEventListener('pointerup', handleMouseUp);
    canvas.addEventListener('pointercancel', handleMouseUp);
    canvas.addEventListener('lostpointercapture', handleMouseUp);
    
    // Map displayed pixels to original image pixels. This keeps existing overlays draggable
    // even when CSS scales the photo inside the responsive editing workspace.
    function canvasPoint(e) {
        const rect = canvas.getBoundingClientRect();
        return {
            x: (e.clientX - rect.left) * canvas.width / rect.width,
            y: (e.clientY - rect.top) * canvas.height / rect.height
        };
    }

    // refNum6. Mouse Event Handlers
    function handleMouseDown(e) {
        const point = canvasPoint(e);
        const mouseX = point.x;
        const mouseY = point.y;
        
        // Check if click is within Snow Mode bounds (highest priority - top layer)
        if (showSnowMode && snowModeImage) {
            if (mouseX >= snowModeX && mouseX <= snowModeX + snowModeWidth &&
                mouseY >= snowModeY && mouseY <= snowModeY + snowModeHeight) {
                isDragging = true;
                isDraggingSnowMode = true;
                dragStartX = mouseX - snowModeX;
                dragStartY = mouseY - snowModeY;
                return;
            }
        }
        
        if (showGreatGasMileage && greatGasMileageImage) {
            if (mouseX >= greatGasMileageX && mouseX <= greatGasMileageX + greatGasMileageWidth &&
                mouseY >= greatGasMileageY && mouseY <= greatGasMileageY + greatGasMileageHeight) {
                isDragging = true;
                isDraggingGreatGasMileage = true;
                dragStartX = mouseX - greatGasMileageX;
                dragStartY = mouseY - greatGasMileageY;
                return;
            }
        }

        // Check if click is within Great Reliability bounds
        if (showGreatReliability && greatReliabilityImage) {
            if (mouseX >= greatReliabilityX && mouseX <= greatReliabilityX + greatReliabilityWidth &&
                mouseY >= greatReliabilityY && mouseY <= greatReliabilityY + greatReliabilityHeight) {
                isDragging = true;
                isDraggingGreatReliability = true;
                dragStartX = mouseX - greatReliabilityX;
                dragStartY = mouseY - greatReliabilityY;
                return;
            }
        }
        
        // Check if click is within text bounds
        if (topText.value) {
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
    }
    
    // refNum7. Mouse Movement Handler
    function handleMouseMove(e) {
        if (!isDragging) return;

        const point = canvasPoint(e);
        const mouseX = point.x;
        const mouseY = point.y;
        
        if (isDraggingSnowMode) {
            // Calculate position based on mouse position relative to canvas
            // Allow movement outside canvas bounds for free positioning
            snowModeX = mouseX - dragStartX;
            snowModeY = mouseY - dragStartY;
            
            redrawCanvas();
        } else if (isDraggingGreatReliability) {
            // Calculate position based on mouse position relative to canvas
            // Allow movement outside canvas bounds for free positioning
            greatReliabilityX = mouseX - dragStartX;
            greatReliabilityY = mouseY - dragStartY;
            
            redrawCanvas();
        } else if (isDraggingGreatGasMileage) {
            greatGasMileageX = mouseX - dragStartX;
            greatGasMileageY = mouseY - dragStartY;

            redrawCanvas();
        } else if (isDraggingTopText) {
            textX = mouseX - dragStartX;
            textY = mouseY - dragStartY;
            
            // Keep text within canvas bounds
            textX = Math.max(0, Math.min(textX, canvas.width - ctx.measureText(topText.value.toUpperCase()).width));
            textY = Math.max(topFontSize, Math.min(textY, canvas.height - 20));
            
            redrawCanvas();
        }
    }
    
    // refNum8. Mouse Up Handler
    function handleMouseUp() {
        isDragging = false;
        isDraggingTopText = false;
        isDraggingSnowMode = false;
        isDraggingGreatReliability = false;
        isDraggingGreatGasMileage = false;
    }
    
    // Function to update Snow Mode dimensions based on scale
    function updateSnowModeDimensions() {
        if (snowModeImage) {
            snowModeWidth = snowModeImage.width * snowModeScale;
            snowModeHeight = snowModeImage.height * snowModeScale;
        }
    }
    
    // Function to update Great Reliability dimensions based on scale
    function updateGreatReliabilityDimensions() {
        if (greatReliabilityImage) {
            greatReliabilityWidth = greatReliabilityImage.width * greatReliabilityScale;
            greatReliabilityHeight = greatReliabilityImage.height * greatReliabilityScale;
        }
    }

    function updateGreatGasMileageDimensions() {
        if (greatGasMileageImage) {
            greatGasMileageWidth = greatGasMileageImage.width * greatGasMileageScale;
            greatGasMileageHeight = greatGasMileageImage.height * greatGasMileageScale;
        }
    }
    
    // refNum9. Text Drawing Function
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
    
    // refNum10. Gradient Rectangle Drawing Function
    function drawGradientRectangle() {
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');    // White at start
        gradient.addColorStop(0.6, 'rgba(255, 255, 255, 1)');  // Stay white until 60% across
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');    // Fade to transparent at end
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, 120);  // Back to 120px height
    }
    
    // Function to toggle "COMING SOON" text
    function addComingSoonText() {
        showComingSoon = !showComingSoon;
        redrawCanvas();
    }
    
    // Function to add Snow Mode overlay
    function addSnowModeOverlay() {
        if (!showSnowMode) {
            // Load the image if not already loaded
            if (!snowModeImage) {
                const img = new Image();
                img.onload = function() {
                    snowModeImage = img;
                    // Set initial dimensions based on scale
                    updateSnowModeDimensions();
                    // Set initial position (center of canvas)
                    if (canvas.width && canvas.height) {
                        snowModeX = (canvas.width - snowModeWidth) / 2;
                        snowModeY = (canvas.height - snowModeHeight) / 2;
                    }
                    showSnowMode = true;
                    redrawCanvas();
                };
                img.onerror = function() {
                    console.error('Error loading Snow Mode image');
                    alert('Error loading Snow Mode image. Please make sure the file exists.');
                };
                img.src = 'New Project.png';
            } else {
                // Image already loaded, just show it
                updateSnowModeDimensions();
                if (canvas.width && canvas.height && snowModeX === 0 && snowModeY === 0) {
                    snowModeX = (canvas.width - snowModeWidth) / 2;
                    snowModeY = (canvas.height - snowModeHeight) / 2;
                }
                showSnowMode = true;
                redrawCanvas();
            }
        } else {
            // Toggle off
            showSnowMode = false;
            redrawCanvas();
        }
    }
    
    // Function to remove Snow Mode overlay
    function removeSnowModeOverlay() {
        showSnowMode = false;
        redrawCanvas();
    }
    
    // Function to add Great Reliability badge
    function addGreatReliabilityBadge() {
        if (!showGreatReliability) {
            // Load the image if not already loaded
            if (!greatReliabilityImage) {
                const img = new Image();
                img.onload = function() {
                    greatReliabilityImage = img;
                    // Set initial dimensions based on scale
                    updateGreatReliabilityDimensions();
                    // Set initial position (center of canvas)
                    if (canvas.width && canvas.height) {
                        greatReliabilityX = (canvas.width - greatReliabilityWidth) / 2;
                        greatReliabilityY = (canvas.height - greatReliabilityHeight) / 2;
                    }
                    showGreatReliability = true;
                    redrawCanvas();
                };
                img.onerror = function() {
                    console.error('Error loading Great Reliability image');
                    alert('Error loading Great Reliability image. Please make sure the file exists.');
                };
                img.src = 'grbNEW.png';
            } else {
                // Image already loaded, just show it
                updateGreatReliabilityDimensions();
                if (canvas.width && canvas.height && greatReliabilityX === 0 && greatReliabilityY === 0) {
                    greatReliabilityX = (canvas.width - greatReliabilityWidth) / 2;
                    greatReliabilityY = (canvas.height - greatReliabilityHeight) / 2;
                }
                showGreatReliability = true;
                redrawCanvas();
            }
        } else {
            // Toggle off
            showGreatReliability = false;
            redrawCanvas();
        }
    }
    
    // Function to remove Great Reliability badge
    function removeGreatReliabilityBadge() {
        showGreatReliability = false;
        redrawCanvas();
    }

    function addGreatGasMileageBadge() {
        if (!showGreatGasMileage) {
            if (!greatGasMileageImage) {
                const img = new Image();
                img.onload = function() {
                    greatGasMileageImage = img;
                    updateGreatGasMileageDimensions();
                    if (canvas.width && canvas.height) {
                        greatGasMileageX = (canvas.width - greatGasMileageWidth) / 2;
                        greatGasMileageY = (canvas.height - greatGasMileageHeight) / 2;
                    }
                    showGreatGasMileage = true;
                    redrawCanvas();
                };
                img.onerror = function() {
                    console.error('Error loading Great Gas Mileage image');
                    alert('Error loading Great Gas Mileage image. Please make sure the file exists.');
                };
                img.src = 'great-gas-mileage-embedded.png';
            } else {
                updateGreatGasMileageDimensions();
                if (canvas.width && canvas.height && greatGasMileageX === 0 && greatGasMileageY === 0) {
                    greatGasMileageX = (canvas.width - greatGasMileageWidth) / 2;
                    greatGasMileageY = (canvas.height - greatGasMileageHeight) / 2;
                }
                showGreatGasMileage = true;
                redrawCanvas();
            }
        } else {
            showGreatGasMileage = false;
            redrawCanvas();
        }
    }

    function removeGreatGasMileageBadge() {
        showGreatGasMileage = false;
        redrawCanvas();
    }
    
    // Function to draw "COMING SOON" text
    function drawComingSoonText() {
        if (!canvas.width || !canvas.height) return;
        
        // Save current context state
        ctx.save();
        
        // Set font and size
        ctx.font = `${comingSoonFontSize}px Impact`;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'; // 60% opacity white
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Calculate center position of the canvas
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        // Draw the text centered horizontally and vertically
        ctx.fillText('COMING SOON', centerX, centerY);
        
        // Restore context state
        ctx.restore();
    }
    
    // refNum11. Canvas Redraw Function
    function redrawCanvas() {
        if (!canvas.width || !canvas.height) return;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Redraw base image if it exists
        if (baseImage) {
            ctx.drawImage(baseImage, 0, 0);
        }
        
        // Draw Great Reliability badge if enabled (lowest layer - drawn first)
        if (showGreatReliability && greatReliabilityImage) {
            // Save context to preserve transparency
            ctx.save();
            // Draw the image with scaling - transparency is preserved automatically
            ctx.drawImage(
                greatReliabilityImage, 
                greatReliabilityX, 
                greatReliabilityY,
                greatReliabilityWidth,
                greatReliabilityHeight
            );
            ctx.restore();
        }

        if (showGreatGasMileage && greatGasMileageImage) {
            ctx.save();
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(
                greatGasMileageImage,
                greatGasMileageX,
                greatGasMileageY,
                greatGasMileageWidth,
                greatGasMileageHeight
            );
            ctx.restore();
        }
        
        // Draw gradient rectangle
        drawGradientRectangle();
        
        // Draw overlay
        if (overlayImage.complete && overlayImage.naturalWidth) {
            ctx.drawImage(overlayImage, 5, 5);
        }
        
        // Draw top text if it exists
        if (topText.value) {
            drawTextWithGlow(topText.value, textX, textY, true);
        }
        
        // Draw Snow Mode overlay if enabled (above top text, below bottom text)
        if (showSnowMode && snowModeImage) {
            // Save context to preserve transparency
            ctx.save();
            // Draw the image with scaling - transparency is preserved automatically
            ctx.drawImage(
                snowModeImage, 
                snowModeX, 
                snowModeY,
                snowModeWidth,
                snowModeHeight
            );
            ctx.restore();
        }
        
        // Draw bottom text if it exists
        if (bottomText.value) {
            const bottomPadding = 20;
            drawTextWithGlow(bottomText.value, canvas.width / 2, canvas.height - bottomPadding, false);
        }
        
        // Draw "COMING SOON" text if enabled
        if (showComingSoon) {
            drawComingSoonText();
        }
    }
    
    let baseImage = null;
    
    // refNum12. Download Handler
    function downloadImage() {
        const stockNumber = document.getElementById('stockNumber').value.trim();
        
        if (!stockNumber) {
            alert('Please enter a stock number before downloading.');
            return;
        }

        if (!baseImage) {
            alert('Please upload an image before downloading.');
            return;
        }

        try {
            canvas.toBlob((blob) => {
                if (!blob) {
                    alert('The image could not be exported. Please try again.');
                    return;
                }

                const downloadUrl = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.download = `${stockNumber}.png`;
                link.href = downloadUrl;
                document.body.appendChild(link);
                link.click();
                link.remove();
                window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
            }, 'image/png');
        } catch (error) {
            console.error('Error exporting image:', error);
            alert('The image could not be exported. Please reload the page and try again.');
        }
    }
    
    // refNum4. Image Upload Handler
    function handleImageUpload(e) {
        const file = e.target.files[0];
        // Allow the same file to be selected a second time.
        e.target.value = '';
        if (file) acceptFiles([file]);
    }

    function handleImageFile(file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const img = new Image();
            img.onload = function() {
                // refNum5. Canvas Setup
                canvas.width = img.width;                          // Reference refNum7
                canvas.height = img.height;
                
                // Store base image
                baseImage = img;
                document.body.classList.add('has-image');
                fileName.textContent = file.name;
                previewStatus.textContent = 'PHOTO LOADED';
                
                // Reset text position and font sizes
                textX = logoWidth + 15;
                textY = 65;
                topFontSize = 48;
                bottomFontSize = 48;
                comingSoonFontSize = 60;
                showComingSoon = false;
                
                // Reset Snow Mode position if it's shown
                if (showSnowMode && snowModeImage) {
                    updateSnowModeDimensions();
                    snowModeX = (canvas.width - snowModeWidth) / 2;
                    snowModeY = (canvas.height - snowModeHeight) / 2;
                }
                
                // Reset Great Reliability position if it's shown
                if (showGreatReliability && greatReliabilityImage) {
                    updateGreatReliabilityDimensions();
                    greatReliabilityX = (canvas.width - greatReliabilityWidth) / 2;
                    greatReliabilityY = (canvas.height - greatReliabilityHeight) / 2;
                }

                if (showGreatGasMileage && greatGasMileageImage) {
                    updateGreatGasMileageDimensions();
                    greatGasMileageX = (canvas.width - greatGasMileageWidth) / 2;
                    greatGasMileageY = (canvas.height - greatGasMileageHeight) / 2;
                }
                
                // Redraw canvas with new image
                redrawCanvas();
                
                // refNum8. Enable Download
                downloadBtn.disabled = false;                      // Reference refNum8
            };
            img.onerror = () => alert('This image could not be opened. Please choose a valid photo.');
            img.src = event.target.result;
        };
        reader.onerror = () => alert('This image could not be read. Please try another file.');
        reader.readAsDataURL(file);
    }
}); 