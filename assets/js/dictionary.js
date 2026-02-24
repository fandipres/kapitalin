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

    const formatTitle = (key) => {
        const withSpaces = key.replace(/([A-Z])/g, ' $1');
        return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
    };

    const renderKamus = () => {
        kamusContainer.innerHTML = '';
        const sortedCategoryKeys = Object.keys(wordData).sort((a, b) => a.localeCompare(b));

        sortedCategoryKeys.forEach(key => {
            if (wordData[key] && wordData[key].length > 0) {
                const words = [...wordData[key]].sort((a, b) => a.localeCompare(b));
                const title = formatTitle(key);

                const row = document.createElement('div');
                row.className = 'bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden w-full transition-all duration-200';

                row.innerHTML = `
                    <button class="w-full flex justify-between items-center p-5 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 transition-colors duration-200 category-toggle">
                        <div class="flex flex-col items-start text-left">
                            <h3 class="text-lg font-bold text-gray-800">${title}</h3>
                            <p class="text-sm text-gray-500 mt-1">${words.length.toLocaleString('id-ID')} entri kata</p>
                        </div>
                        <div class="flex-shrink-0 ml-4 bg-indigo-50 text-indigo-500 p-2 rounded-full">
                            <i class="fas fa-chevron-down transition-transform duration-300 transform chevron-icon"></i>
                        </div>
                    </button>
                    <div class="category-content hidden border-t border-gray-100 p-5 bg-gray-50">
                        <div class="flex flex-wrap gap-2">
                            ${words.map(word => `<span class="bg-white border border-gray-200 text-gray-700 text-xs font-medium px-3 py-1.5 rounded-full shadow-sm select-all">${word}</span>`).join('')}
                        </div>
                    </div>
                `;

                const toggleBtn = row.querySelector('.category-toggle');
                const contentDiv = row.querySelector('.category-content');
                const chevronIcon = row.querySelector('.chevron-icon');

                toggleBtn.addEventListener('click', () => {
                    const isHidden = contentDiv.classList.contains('hidden');

                    document.querySelectorAll('.category-content').forEach(el => el.classList.add('hidden'));
                    document.querySelectorAll('.chevron-icon').forEach(el => el.classList.remove('rotate-180'));

                    if (isHidden) {
                        contentDiv.classList.remove('hidden');
                        chevronIcon.classList.add('rotate-180');
                    }
                });

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

        if (dictionaryCountEl) {
            dictionaryCountEl.textContent = calculateTotalWords().toLocaleString('id-ID');
        }

        renderKamus();

        if (hamburgerBtn) hamburgerBtn.addEventListener('click', toggleMenu);
        if (overlay) overlay.addEventListener('click', toggleMenu);
    };

    init();
});