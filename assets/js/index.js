document.addEventListener('DOMContentLoaded', () => {
    const textarea = document.getElementById('main-textarea');
    const charCountEl = document.getElementById('char-count');
    const wordCountEl = document.getElementById('word-count');
    const clearBtn = document.getElementById('clear-btn');
    const copyBtn = document.getElementById('copy-btn');
    const processBtn = document.getElementById('process-btn');
    const rulesContainer = document.getElementById('rules-container');
    const selectAllBtn = document.getElementById('select-all-btn');
    const deselectAllBtn = document.getElementById('deselect-all-btn');
    const yearEl = document.getElementById('year');
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const overlay = document.getElementById('overlay');

    const modal = document.getElementById('modal');
    const modalContent = document.getElementById('modal-content');
    const modalCloseBtn = document.getElementById('modal-close');

    const rulesModal = document.getElementById('rules-modal');
    const openRulesBtn = document.getElementById('open-rules-btn');
    const rulesModalClose = document.getElementById('rules-modal-close');
    const rulesModalDone = document.getElementById('rules-modal-done');

    const customWordsModal = document.getElementById('custom-words-modal');
    const openCustomWordsBtn = document.getElementById('open-custom-words-btn');
    const customWordsModalClose = document.getElementById('custom-words-modal-close');
    const customWordsModalDone = document.getElementById('custom-words-modal-done');

    const init = () => {
        if (textarea) textarea.value = '';
        if (yearEl) yearEl.textContent = new Date().getFullYear();
        updateCounts();
        generateRules();
        addEventListeners();
    };

    const generateRules = () => {
        if (!rulesContainer) return;
        rulesContainer.innerHTML = '';
        
        ruleOptions.forEach(rule => {
            if (rule.id === 'namaOrang') return;

            const isChecked = rule.checked ? 'checked' : '';
            const isDisabled = rule.disabled ? 'disabled' : '';
            const opacityClass = rule.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';

            const ruleHTML = `
                <div class="flex justify-between items-start p-2 rounded-lg transition-colors duration-200 hover:bg-gray-50">
                    <label for="${rule.id}" class="flex-1 flex items-start space-x-3 min-w-0 ${opacityClass}">
                        <input type="checkbox" id="${rule.id}" name="${rule.id}" ${isChecked} ${isDisabled} class="h-5 w-5 mt-0.5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 flex-shrink-0" />
                        <span class="text-gray-700 select-none text-sm font-medium">${rule.label}</span>
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
        if (mobileMenu) mobileMenu.classList.toggle('-translate-x-full');
        if (overlay) {
            if (overlay.classList.contains('hidden')) {
                overlay.classList.remove('hidden');
                overlay.classList.add('block');
            } else {
                overlay.classList.add('hidden');
                overlay.classList.remove('block');
            }
        }
    };

    const openRulesModal = (e) => {
        if (e) e.preventDefault();
        if (!rulesModal) return;
        rulesModal.classList.remove('hidden');
        rulesModal.classList.add('flex');
    };

    const closeRulesModal = (e) => {
        if (e) e.preventDefault();
        if (!rulesModal) return;
        rulesModal.classList.add('hidden');
        rulesModal.classList.remove('flex');
    };

    const openCustomWordsModal = (e) => {
        if (e) e.preventDefault();
        if (!customWordsModal) return;
        customWordsModal.classList.remove('hidden');
        customWordsModal.classList.add('flex');
    };

    const closeCustomWordsModal = (e) => {
        if (e) e.preventDefault();
        if (!customWordsModal) return;
        customWordsModal.classList.add('hidden');
        customWordsModal.classList.remove('flex');
    };

    const addEventListeners = () => {
        if (textarea) textarea.addEventListener('input', updateCounts);
        if (clearBtn) clearBtn.addEventListener('click', clearText);
        if (copyBtn) copyBtn.addEventListener('click', copyToClipboard);
        if (processBtn) processBtn.addEventListener('click', checkAndFixText);
        
        if (hamburgerBtn) hamburgerBtn.addEventListener('click', toggleMenu);
        if (overlay) overlay.addEventListener('click', toggleMenu);

        if (selectAllBtn) selectAllBtn.addEventListener('click', () => selectAllRules(true));
        if (deselectAllBtn) deselectAllBtn.addEventListener('click', () => selectAllRules(false));
        if (openRulesBtn) openRulesBtn.addEventListener('click', openRulesModal);
        if (rulesModalClose) rulesModalClose.addEventListener('click', closeRulesModal);
        if (rulesModalDone) rulesModalDone.addEventListener('click', closeRulesModal);
        if (rulesModal) {
            rulesModal.addEventListener('click', (e) => { 
                if (e.target === rulesModal) closeRulesModal(); 
            });
        }

        if (openCustomWordsBtn) openCustomWordsBtn.addEventListener('click', openCustomWordsModal);
        if (customWordsModalClose) customWordsModalClose.addEventListener('click', closeCustomWordsModal);
        if (customWordsModalDone) customWordsModalDone.addEventListener('click', closeCustomWordsModal);
        if (customWordsModal) {
            customWordsModal.addEventListener('click', (e) => { 
                if (e.target === customWordsModal) closeCustomWordsModal(); 
            });
        }

        if (rulesContainer) {
            rulesContainer.addEventListener('click', (e) => {
                const infoBtn = e.target.closest('.info-btn');
                if (infoBtn) {
                    const ruleId = infoBtn.dataset.ruleId;
                    const rule = ruleOptions.find(r => r.id === ruleId);
                    if (rule) showModal(rule);
                }
            });
        }
        
        if (modal) modal.addEventListener('click', hideModal);
        if (modalCloseBtn) modalCloseBtn.addEventListener('click', hideModal);
        if (modalContent) modalContent.addEventListener('click', (e) => e.stopPropagation());
    };

    const updateCounts = () => {
        if (!textarea || !charCountEl || !wordCountEl) return;
        const text = textarea.value;
        charCountEl.textContent = text.length.toLocaleString('id-ID');
        wordCountEl.textContent = (text.trim() === '' ? 0 : text.trim().split(/\s+/).filter(Boolean).length).toLocaleString('id-ID');
    };

    const clearText = () => {
        if (textarea) textarea.value = '';
        updateCounts();
    };

    const copyToClipboard = () => {
        if (!textarea || !textarea.value) return;
        navigator.clipboard.writeText(textarea.value).then(() => {
            if (copyBtn) {
                const originalHTML = copyBtn.innerHTML;
                copyBtn.innerHTML = `<i class="fas fa-check text-emerald-500"></i><span class="text-emerald-600">Tersalin!</span>`;
                setTimeout(() => { copyBtn.innerHTML = originalHTML; }, 2000);
            }
        });
    };

    const selectAllRules = (select) => {
        if (!rulesContainer) return;
        rulesContainer.querySelectorAll('input[type="checkbox"]:not(:disabled)').forEach(cb => cb.checked = select);
    };

    const showModal = (content) => {
        document.getElementById('modal-title').textContent = content.label;
        document.getElementById('modal-description').textContent = content.description;
        document.getElementById('modal-example').textContent = content.example;
        if (modal) {
            modal.classList.remove('hidden');
            modal.classList.add('flex');
        }
    };

    const hideModal = () => {
        if (modal) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }
    };

    const checkAndFixText = () => {
        if (!textarea) return;
        let processedText = textarea.value.toLowerCase();
        const rules = {};
        
        if (rulesContainer) {
            rulesContainer.querySelectorAll('input[type="checkbox"]').forEach(cb => {
                rules[cb.id] = cb.checked;
            });
        }

        const capitalizeFromList = (txt, list) => {
            if (!list || list.length === 0) return txt;
            const sortedList = list.sort((a, b) => b.length - a.length);

            sortedList.forEach(item => {
                const escapedItem = item.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                const flexibleEscapedItem = escapedItem.endsWith('\\.')
                    ? escapedItem.slice(0, -2) + '\\.?'
                    : escapedItem;

                const regex = new RegExp(`(^|\\s|,)(${flexibleEscapedItem})(?=[\\s.,!?]|$)`, 'gi');

                txt = txt.replace(regex, (match, p1, p2) => {
                    return p1 + item;
                });
            });
            return txt;
        };

        let customWordsText = '';
        document.querySelectorAll('#customWords').forEach(input => {
            if (input.value.trim() !== '') customWordsText += input.value + '\n';
        });
        
        if (customWordsText.trim() !== '') {
            const customWordList = customWordsText.split(/[,\n]/).map(w => w.trim()).filter(Boolean);
            const capitalizedCustomList = customWordList.map(w => w.split(' ').map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()).join(' '));
            processedText = capitalizeFromList(processedText, capitalizedCustomList);
        }

        if (rules.awalKalimat) {
            processedText = processedText.replace(/(^\s*\w|[\.\!\?]\s*\w)/gm, c => c.toUpperCase());
        }
        if (rules.awalPetikan) {
            processedText = processedText.replace(/(["“]\s*\w)/g, c => c.toUpperCase());
        }
        if (rules.namaAgamaTuhan) {
            processedText = capitalizeFromList(processedText, (wordData.ketuhanan || []).concat(wordData.agama || [], wordData.kitab || []));
            processedText = processedText.replace(/\b(hamba|ciptaan|umat|rahmat)-(mu|nya)\b/gi, (m, p1, p2) => `${p1.charAt(0).toUpperCase() + p1.slice(1)}-${p2.charAt(0).toUpperCase() + p2.slice(1)}`);
        }
        if (rules.gelarKehormatanDiikutiNama || rules.gelarSapaan || rules.jabatanDiikutiNama || rules.sapaanKekerabatan) {
            processedText = capitalizeFromList(processedText, wordData.gelar || []);
        }
        if (rules.singkatanGelar) {
            processedText = capitalizeFromList(processedText, wordData.singkatanGelar || []);
        }
        if (rules.namaBangsa) {
            processedText = capitalizeFromList(processedText, wordData.suku || []);
        }
        if (rules.namaWaktu) {
            processedText = capitalizeFromList(processedText, (wordData.hari || []).concat(wordData.bulan || []));
        }
        if (rules.namaPeristiwaSejarah) {
            processedText = capitalizeFromList(processedText, wordData.peristiwaSejarah || []);
        }
        if (rules.namaGeografi) {
            processedText = capitalizeFromList(processedText, (wordData.kota || []).concat(wordData.provinsi || [], wordData.negara || []));
        }
        if (rules.namaLembagaDokumen) {
            processedText = capitalizeFromList(processedText, (wordData.institusi || []).concat(wordData.dokumen || []));
        }

        textarea.value = processedText;
        updateCounts();
    };

    init();
});