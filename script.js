// script.js

const canvas = document.getElementById('keyCanvas');
const ctx = canvas.getContext('2d');
const upload = document.getElementById('upload');
const screenModeButton = document.getElementById('screenModeButton');
const imageModeButton = document.getElementById('imageModeButton');
const screenModeInstructions = document.getElementById('screenModeInstructions');

const lengthSlider = document.getElementById('lengthSlider');
const widthSlider = document.getElementById('widthSlider');
const depthSlider = document.getElementById('depthSlider');
const cutsSlider = document.getElementById('cutsSlider');

const lengthValue = document.getElementById('lengthValue');
const widthValue = document.getElementById('widthValue');
const depthValue = document.getElementById('depthValue');
const cutsValue = document.getElementById('cutsValue');

const exportButton = document.getElementById('exportData');

let keyImage = new Image();
let isScreenMode = false;

// Set default canvas dimensions
canvas.width = 600;
canvas.height = 300;

// Update overlay when sliders change
function updateOverlay() {
    const length = parseInt(lengthSlider.value);
    const width = parseInt(widthSlider.value);
    const depth = parseInt(depthSlider.value);
    const cuts = parseInt(cutsSlider.value);

    // Update displayed values
    lengthValue.textContent = length;
    widthValue.textContent = width;
    depthValue.textContent = depth;
    cutsValue.textContent = cuts;

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

    // Draw cut markers
    const startX = (canvas.width - length) / 2;
    const startY = (canvas.height - width) / 2;
    for (let i = 1; i <= cuts; i++) {
        const x = startX + (i * length / (cuts + 1));
        ctx.beginPath();
        ctx.moveTo(x, startY);
        ctx.lineTo(x, startY + width * (depth / 10));
        ctx.stroke();
    }
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

// Update overlay based on slider changes
[lengthSlider, widthSlider, depthSlider, cutsSlider].forEach(slider => {
    slider.addEventListener('input', updateOverlay);
});

// Export measurements
exportButton.addEventListener('click', () => {
    const measurements = {
        length: lengthSlider.value,
        width: widthSlider.value,
        depth: depthSlider.value,
        cuts: cutsSlider.value
    };
    alert(`Measurements exported: ${JSON.stringify(measurements)}`);
});
