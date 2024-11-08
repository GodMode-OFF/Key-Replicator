// script.js

const canvas = document.getElementById('keyCanvas');
const ctx = canvas.getContext('2d');
const upload = document.getElementById('upload');
const lengthSlider = document.getElementById('lengthSlider');
const widthSlider = document.getElementById('widthSlider');
const depthSlider = document.getElementById('depthSlider');
const exportButton = document.getElementById('exportData');

let keyImage = new Image();

// Set default canvas dimensions
canvas.width = 500;
canvas.height = 300;

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
                drawOverlay();
            };
        };
        reader.readAsDataURL(file);
    }
});

// Draw overlay based on slider values
function drawOverlay() {
    const length = lengthSlider.value;
    const width = widthSlider.value;
    const depth = depthSlider.value;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(keyImage, 0, 0, canvas.width, canvas.height);

    // Draw overlay
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    ctx.strokeRect((canvas.width - length) / 2, (canvas.height - width) / 2, length, width);

    // Draw cut depth markers
    const cuts = 5; // number of cuts (adjustable if needed)
    for (let i = 1; i < cuts; i++) {
        ctx.moveTo((canvas.width - length) / 2 + (length / cuts) * i, (canvas.height - width) / 2);
        ctx.lineTo((canvas.width - length) / 2 + (length / cuts) * i, (canvas.height - width) / 2 + width * depth / 10);
    }
    ctx.stroke();
}

// Update overlay when sliders change
[lengthSlider, widthSlider, depthSlider].forEach(slider => {
    slider.addEventListener('input', drawOverlay);
});

// Export measurements
exportButton.addEventListener('click', () => {
    const measurements = {
        length: lengthSlider.value,
        width: widthSlider.value,
        depth: depthSlider.value
    };
    alert(`Measurements: ${JSON.stringify(measurements)}`);
});
