const upload = document.getElementById('upload');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const brightnessSlider = document.getElementById('brightness');
const contrastSlider = document.getElementById('contrast');

let originalImage = new Image();

upload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
        originalImage.onload = () => {
            canvas.width = originalImage.width;
            canvas.height = originalImage.height;
            ctx.drawImage(originalImage, 0, 0);
            applyFilters();
        };
        originalImage.src = reader.result;
    };
    reader.readAsDataURL(file);
});

brightnessSlider.addEventListener('input', applyFilters);
contrastSlider.addEventListener('input', applyFilters);

function applyFilters() {
    if (!originalImage.src) return;
    ctx.drawImage(originalImage, 0, 0);
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let data = imageData.data;
    const brightness = parseInt(brightnessSlider.value);
    const contrast = parseInt(contrastSlider.value);
    const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
    for (let i = 0; i < data.length; i += 4) {
        data[i] = factor * (data[i] - 128) + 128 + (brightness - 100);
        data[i + 1] = factor * (data[i + 1] - 128) + 128 + (brightness - 100);
        data[i + 2] = factor * (data[i + 2] - 128) + 128 + (brightness - 100);
    }
    ctx.putImageData(imageData, 0, 0);
}

function downloadImage() {
    const link = document.createElement('a');
    link.download = 'enhanced_image.png';
    link.href = canvas.toDataURL();
    link.click();
}