if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(registration => {
                console.log('ServiceWorker Kapitalin sukses didaftarkan! Scope:', registration.scope);
            })
            .catch(error => {
                console.error('ServiceWorker gagal didaftarkan:', error);
            });
    });
}