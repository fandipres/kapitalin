document.addEventListener('DOMContentLoaded', () => {
    const textarea = document.getElementById('main-textarea');
    const charCountEl = document.getElementById('char-count');
    const wordCountEl = document.getElementById('word-count');
    const clearBtn = document.getElementById('clear-btn');
    const copyBtn = document.getElementById('copy-btn');
    const processBtn = document.getElementById('process-btn');
    const customWordsInput = document.getElementById('customWords');
    const rulesContainer = document.getElementById('rules-container');
    const selectAllBtn = document.getElementById('select-all-btn');
    const deselectAllBtn = document.getElementById('deselect-all-btn');
    const yearEl = document.getElementById('year');
    const modal = document.getElementById('modal');
    const modalContent = document.getElementById('modal-content');
    const modalCloseBtn = document.getElementById('modal-close');
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const overlay = document.getElementById('overlay');

    const calculateTotalWords = () => {
        return Object.values(wordData).reduce((total, category) => total + category.length, 0);
    };

    const init = () => {
        textarea.value = 'selamat datang di medan. teman saya, dr. budi, adalah orang suku jawa. dia berkata: "semoga tuhan yang maha esa memberkati kita semua." kita akan merayakan proklamasi kemerdekaan indonesia pada bulan agustus. salam untuk bapak presiden.';
        yearEl.textContent = new Date().getFullYear();
        updateCounts();
        generateRules();
        addEventListeners();
    };

    const generateRules = () => {
        rulesContainer.innerHTML = '';
        ruleOptions.forEach(rule => {
            const isChecked = rule.checked ? 'checked' : '';
            const isDisabled = rule.disabled ? 'disabled' : '';
            const opacityClass = rule.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';

            const ruleHTML = `
                <div class="flex justify-between items-start p-2 rounded-lg transition-colors duration-200 hover:bg-gray-100">
                    <label for="${rule.id}" class="flex-1 flex items-start space-x-3 min-w-0 ${opacityClass}">
                        <input type="checkbox" id="${rule.id}" name="${rule.id}" ${isChecked} ${isDisabled} class="h-5 w-5 mt-0.5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 flex-shrink-0" />
                        <span class="text-gray-700 select-none">${rule.label}</span>
                    </label>
                    <div class="flex-shrink-0 flex items-center space-x-2 pl-2">
                        ${rule.disabled ? `<div class="tooltip"><i class="fas fa-info-circle text-gray-400"></i><span class="tooltiptext">${rule.tooltip}</span></div>` : ''}
                        <button data-rule-id="${rule.id}" class="info-btn text-gray-400 hover:text-indigo-600 focus:outline-none" aria-label="Info untuk ${rule.label}"><i class="fas fa-question-circle"></i></button>
                    </div>
                </div>
            `;
            rulesContainer.insertAdjacentHTML('beforeend', ruleHTML);
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

    const addEventListeners = () => {
        textarea.addEventListener('input', updateCounts);
        clearBtn.addEventListener('click', clearText);
        copyBtn.addEventListener('click', copyToClipboard);
        processBtn.addEventListener('click', checkAndFixText);
        selectAllBtn.addEventListener('click', () => selectAllRules(true));
        deselectAllBtn.addEventListener('click', () => selectAllRules(false));

        hamburgerBtn.addEventListener('click', toggleMenu);
        overlay.addEventListener('click', toggleMenu);

        rulesContainer.addEventListener('click', (e) => {
            const infoBtn = e.target.closest('.info-btn');
            if (infoBtn) {
                const ruleId = infoBtn.dataset.ruleId;
                const rule = ruleOptions.find(r => r.id === ruleId);
                if (rule) showModal(rule);
            }
        });

        modal.addEventListener('click', hideModal);
        modalCloseBtn.addEventListener('click', hideModal);
        modalContent.addEventListener('click', (e) => e.stopPropagation());
    };

    const updateCounts = () => {
        const text = textarea.value;
        charCountEl.textContent = text.length.toLocaleString('id-ID');
        wordCountEl.textContent = (text.trim() === '' ? 0 : text.trim().split(/\s+/).filter(Boolean).length).toLocaleString('id-ID');
    };

    const clearText = () => {
        textarea.value = '';
        updateCounts();
    };

    const copyToClipboard = () => {
        if (!textarea.value) return;
        navigator.clipboard.writeText(textarea.value).then(() => {
            const originalHTML = copyBtn.innerHTML;
            copyBtn.innerHTML = `<i class="fas fa-check text-green-500"></i><span>Tersalin!</span>`;
            setTimeout(() => {
                copyBtn.innerHTML = originalHTML;
            }, 2000);
        });
    };

    const selectAllRules = (select) => {
        rulesContainer.querySelectorAll('input[type="checkbox"]:not(:disabled)').forEach(cb => cb.checked = select);
    };

    const showModal = (content) => {
        document.getElementById('modal-title').textContent = content.label;
        document.getElementById('modal-description').textContent = content.description;
        document.getElementById('modal-example').textContent = content.example;
        modal.classList.add('flex');
    };

    const hideModal = () => {
        modal.classList.remove('flex');
    };

    const checkAndFixText = () => {
        let processedText = textarea.value.toLowerCase();
        const rules = {};
        rulesContainer.querySelectorAll('input[type="checkbox"]').forEach(cb => {
            rules[cb.id] = cb.checked;
        });

        const capitalizeFromList = (txt, list) => {
            if (!list || list.length === 0) return txt;
            list.forEach(item => {
                const escapedItem = item.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                const itemRegex = escapedItem.replace(/ /g, '\\s+');
                const regex = new RegExp(`\\b${itemRegex}\\b`, 'gi');
                txt = txt.replace(regex, item);
            });
            return txt;
        };

        if (customWordsInput.value.trim() !== '') {
            const customWordList = customWordsInput.value.split(/[,\n]/).map(w => w.trim()).filter(Boolean);
            const capitalizedCustomList = customWordList.map(w => w.split(' ').map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()).join(' '));
            processedText = capitalizeFromList(processedText, capitalizedCustomList);
        }

        if (rules.awalKalimat) processedText = processedText.replace(/(^\s*\w|[\.\!\?]\s*\w)/gm, c => c.toUpperCase());
        if (rules.awalPetikan) processedText = processedText.replace(/(["“]\s*\w)/g, c => c.toUpperCase());
        if (rules.namaAgamaTuhan) {
            processedText = capitalizeFromList(processedText, wordData.tuhan.concat(wordData.agama, wordData.kitab));
            processedText = processedText.replace(/\b(hamba|ciptaan|umat|rahmat)-(mu|nya)\b/gi, (m, p1, p2) => `${p1.charAt(0).toUpperCase() + p1.slice(1)}-${p2.charAt(0).toUpperCase() + p2.slice(1)}`);
        }
        if (rules.namaOrang) processedText = capitalizeFromList(processedText, wordData.nama.concat(wordData.marga));
        if (rules.gelarKehormatanDiikutiNama || rules.gelarSapaan || rules.jabatanDiikutiNama || rules.sapaanKekerabatan) {
            processedText = capitalizeFromList(processedText, wordData.gelar);
        }
        if (rules.singkatanGelar) processedText = capitalizeFromList(processedText, wordData.singkatanGelar);
        if (rules.namaBangsa) processedText = capitalizeFromList(processedText, wordData.suku);
        if (rules.namaWaktu) processedText = capitalizeFromList(processedText, wordData.hari.concat(wordData.bulan));
        if (rules.namaPeristiwaSejarah) processedText = capitalizeFromList(processedText, wordData.peristiwaSejarah);
        if (rules.namaGeografi) processedText = capitalizeFromList(processedText, wordData.kota.concat(wordData.provinsi, wordData.negara));
        if (rules.namaLembagaDokumen) processedText = capitalizeFromList(processedText, wordData.institusi.concat(wordData.dokumen));

        textarea.value = processedText;
        updateCounts();
    };

    init();
});