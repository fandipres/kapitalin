/**
 * Core capitalization logic for Kapitalin, kept dependency-free (no DOM)
 * so it can be loaded both in the browser (as a plain <script>) and in
 * Node for automated tests.
 */
(function (root, factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.Capitalizer = factory();
    }
})(typeof self !== 'undefined' ? self : this, function () {

    const capitalizeFromList = (text, list) => {
        if (!list || list.length === 0) return text;
        const sortedList = [...list].sort((a, b) => b.length - a.length);

        sortedList.forEach(item => {
            const escapedItem = item.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const flexibleEscapedItem = escapedItem.endsWith('\\.')
                ? escapedItem.slice(0, -2) + '\\.?'
                : escapedItem;

            // Allow a directly-attached Indonesian possessive clitic (ku/mu/nya)
            // before the word boundary, e.g. "tuhanku" should still match "Tuhan".
            const regex = new RegExp(`(^|\\s|,)(${flexibleEscapedItem})(?=(?:ku|mu|nya)?(?:[\\s.,!?]|$))`, 'gi');

            text = text.replace(regex, (match, p1) => p1 + item);
        });
        return text;
    };

    const capitalizeCustomWords = (text, customWordsText) => {
        if (!customWordsText || customWordsText.trim() === '') return text;
        const customWordList = customWordsText.split(/[,\n]/).map(w => w.trim()).filter(Boolean);
        const capitalizedCustomList = customWordList.map(w =>
            w.split(' ').map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()).join(' ')
        );
        return capitalizeFromList(text, capitalizedCustomList);
    };

    const applyCapitalizationRules = (rawText, rules, wordData, customWordsText) => {
        let processedText = rawText.toLowerCase();

        processedText = capitalizeCustomWords(processedText, customWordsText);

        if (rules.awalKalimat) {
            processedText = processedText.replace(/(^\s*\w|[\.\!\?]\s*\w)/gm, c => c.toUpperCase());
        }
        if (rules.awalPetikan) {
            processedText = processedText.replace(/(["“]\s*\w)/g, c => c.toUpperCase());
        }
        if (rules.namaAgamaTuhan) {
            processedText = capitalizeFromList(processedText, (wordData.ketuhanan || []).concat(wordData.agama || [], wordData.kitab || []));
            processedText = processedText.replace(/\b(hamba|ciptaan|umat|rahmat)-(mu|nya)\b/gi, (m, p1, p2) => `${p1}-${p2.charAt(0).toUpperCase() + p2.slice(1)}`);
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

        return processedText;
    };

    return { capitalizeFromList, capitalizeCustomWords, applyCapitalizationRules };
});
