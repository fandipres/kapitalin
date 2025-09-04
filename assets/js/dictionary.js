document.addEventListener('DOMContentLoaded', () => {
    const kamusContainer = document.getElementById('kamus-container');
    const dictionaryCountEl = document.getElementById('dictionary-count');
    const yearEl = document.getElementById('year');
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const overlay = document.getElementById('overlay');

    const calculateTotalWords = () => {
        return Object.values(wordData).reduce((total, category) => total + category.length, 0);
    };

    const renderKamus = () => {
        kamusContainer.innerHTML = '';
        const sortedCategoryKeys = Object.keys(wordData).sort((a, b) => a.localeCompare(b));

        sortedCategoryKeys.forEach(key => {
            if (wordData[key]) {
                const words = [...wordData[key]].sort((a, b) => a.localeCompare(b));
                const title = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                const row = document.createElement('div');
                row.className = 'bg-white p-6 rounded-lg shadow-md w-full';

                row.innerHTML = `
                    <div class="border-b pb-3 mb-4">
                        <h3 class="text-xl font-bold text-indigo-700">${title}</h3>
                        <p class="text-sm text-gray-500 mt-1">${words.length.toLocaleString('id-ID')} kata</p>
                    </div>
                    <div class="flex flex-wrap gap-2">
                        ${words.map(word => `<span class="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-1 rounded-full">${word}</span>`).join('')}
                    </div>
                `;
                kamusContainer.appendChild(row);
            }
        });
    };

    const toggleMenu = () => {
        const isHidden = mobileMenu.classList.contains('-translate-x-full');
        if (isHidden) {
            mobileMenu.classList.remove('-translate-x-full');
            overlay.classList.remove('hidden');
        } else {
            mobileMenu.classList.add('-translate-x-full');
            overlay.classList.add('hidden');
        }
    };

    const init = () => {
        yearEl.textContent = new Date().getFullYear();
        dictionaryCountEl.textContent = calculateTotalWords().toLocaleString('id-ID');
        renderKamus();

        hamburgerBtn.addEventListener('click', toggleMenu);
        overlay.addEventListener('click', toggleMenu);
    };

    init();
});