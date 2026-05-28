document.addEventListener('DOMContentLoaded', () => {
    // Auto-hide flash messages
    document.querySelectorAll('.flash').forEach(el => {
        setTimeout(() => { el.style.opacity = '0'; setTimeout(() => el.remove(), 500); }, 4000);
    });
});