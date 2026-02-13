import exifr from 'exifr';
import i18n from './i18n.js';

export function loadImage(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = e.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

export async function checkOriginal(file) {
    try {
        const exif = await exifr.parse(file, { xmp: true });
        return {
            is_google: exif?.Credit === 'Made with Google AI',
            is_original: ['ImageWidth', 'ImageHeight'].every(key => exif?.[key])
        }
    } catch {
        return { is_google: false, is_original: false };
    }
}

export function getOriginalStatus({ is_google, is_original }) {
    if (!is_google) return i18n.t('original.not_gemini');
    if (!is_original) return i18n.t('original.not_original');
    return '';
}

const statusMessage = document.getElementById('statusMessage');
export function setStatusMessage(message = '', type = '') {
    statusMessage.textContent = message;
    statusMessage.style.display = message ? 'block' : 'none';
    const colorMap = {
        warn: 'text-yellow-500 dark:text-yellow-400',
        success: 'text-emerald-500 dark:text-emerald-400'
    };
    // Clean all potential color classes first
    statusMessage.className = 'mt-6 text-sm min-h-[1.25rem] transition-colors';
    if (colorMap[type]) {
        // Add the color classes (handling multiple classes in the string)
        colorMap[type].split(' ').forEach(cls => statusMessage.classList.add(cls));
    }
}

const loadingOverlay = document.getElementById('loadingOverlay');
export function showLoading(text = null) {
    loadingOverlay.style.display = 'flex';
    const textEl = loadingOverlay.querySelector('p');
    if (textEl && text) textEl.textContent = text;
}

export function hideLoading() {
    loadingOverlay.style.display = 'none';
}
