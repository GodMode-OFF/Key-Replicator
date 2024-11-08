// script.js

const canvas = document.getElementById('keyCanvas');
const ctx = canvas.getContext('2d');
const upload = document.getElementById('upload');
const screenModeButton = document.getElementById('screenModeButton');
const imageModeButton = document.getElementById('imageModeButton');
const screenModeInstructions = document.getElementById('screenModeInstructions');

const lengthSlider = document.getElementById('lengthSlider');
const widthSlider = document.getElementById('widthSlider');
const lengthValue = document.getElementById('lengthValue');
const widthValue = document.getElementById('widthValue');
const exportButton = document.getElementById('exportData');

const addCutButton = document.getElementById('addCutButton');
const cutControlsContainer = document.getElementById('cutControls');

let keyImage = new Image();
let isScreenMode = false;
let cuts = [];  // Array to hold individual cut objects

// Set default canvas dimensions
canvas.width = 600;
canvas.height = 300;

// Update overlay when sliders change
function updateOverlay() {
    const length = parseInt(lengthSlider.value);
    const width = parseInt(widthSlider.value);

    // Update displayed values
    lengthValue.textContent = length;
    widthValue.textContent = width;

    // Clear previous drawing
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw key image in image mode
    if (!isScreenMode && keyImage.src) {
        ctx.drawImage(keyImage, 0, 0, canvas.width, canvas.height);
    }

    // Draw adjustable overlay for measurements
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    ctx.strokeRect((canvas.width - length) / 2, (canvas.height - width) / 2, length, width);

    // Draw each custom cut based on individual settings
    cuts.forEach(cut => {
        const cutX = (canvas.width - length) / 2 + (cut.position / 100) * length;
        ctx.beginPath();
        ctx.moveTo(cutX, (canvas.height - width) / 2);
        ctx.lineTo(cutX, (canvas.height - width) / 2 + width * (cut.depth / 10));
        ctx.stroke();
    });
}

// Event listeners for mode selection
screenModeButton.addEventListener('click', () => {
    isScreenMode = true;
    upload.classList.add('hidden');
    screenModeInstructions.classList.remove('hidden');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

imageModeButton.addEventListener('click', () => {
    isScreenMode = false;
    upload.classList.remove('hidden');
    screenModeInstructions.classList.add('hidden');
});

// Load uploaded image
upload.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            keyImage.src = e.target.result;
            keyImage.onload = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(keyImage, 0, 0, canvas.width, canvas.height);
                updateOverlay();
            };
        };
        reader.readAsDataURL(file);
    }
});

// Handle base measurements
[lengthSlider, widthSlider].forEach(slider => {
    slider.addEventListener('input', updateOverlay);
});

// Add new cut control dynamically
addCutButton.addEventListener('click', () => {
    const cutIndex = cuts.length;
    const newCut = { position: 50, depth: 5 };  // Default values
    cuts.push(newCut);

    // Create HTML elements for this cut
    const cutDiv = document.createElement('div');
    cutDiv.classList.add('cut-control');

    const cutPositionLabel = document.createElement('label');
    cutPositionLabel.innerText = `Cut ${cutIndex + 1} Position:`;
    const cutPositionSlider = document.createElement('input');
    cutPositionSlider.type = 'range';
    cutPositionSlider.min = 0;
    cutPositionSlider.max = 100;
    cutPositionSlider.value = newCut.position;

    const cutDepthLabel = document.createElement('label');
    cutDepthLabel.innerText = `Cut ${cutIndex + 1} Depth:`;
    const cutDepthSlider = document.createElement('input');
    cutDepthSlider.type = 'range';
    cutDepthSlider.min = 1;
    cutDepthSlider.max = 10;
    cutDepthSlider.value = newCut.depth;

    cutDiv.appendChild(cutPositionLabel);
    cutDiv.appendChild(cutPositionSlider);
    cutDiv.appendChild(cutDepthLabel);
    cutDiv.appendChild(cutDepthSlider);
    cutControlsContainer.appendChild(cutDiv);

    // Update cut properties on slider change
    cutPositionSlider.addEventListener('input', () => {
        newCut.position = parseInt(cutPositionSlider.value);
        updateOverlay();
    });

    cutDepthSlider.addEventListener('input', () => {
        newCut.depth = parseInt(cutDepthSlider.value);
        updateOverlay();
    });

    updateOverlay();
});

// Export measurements
exportButton.addEventListener('click', () => {
    const baseMeasurements = {
        length: lengthSlider.value,
        width: widthSlider.value
    };
    const cutData = cuts.map((cut, index) => ({
        cutNumber: index + 1,
        position: cut.position,
        depth: cut.depth
    }));
    alert(`Base Measurements: ${JSON.stringify(baseMeasurements)}, Cuts: ${JSON.stringify(cutData)}`);
});
