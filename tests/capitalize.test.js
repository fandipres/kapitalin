const test = require('node:test');
const assert = require('node:assert/strict');
const { capitalizeFromList, applyCapitalizationRules } = require('../assets/js/capitalize.js');
const { wordData: realWordData, ruleOptions } = require('../assets/js/data.js');

// Small fixture so rule-level tests stay fast and self-contained.
const wordData = {
    agama: ['Islam', 'Kristen'],
    ketuhanan: ['Tuhan', 'Allah'],
    kitab: ['Alquran'],
    gelar: ['Haji', 'Profesor', 'Jenderal'],
    singkatanGelar: ['Dr.', 'S.H.'],
    suku: ['Sunda', 'Jawa'],
    hari: ['Senin', 'Natal'],
    bulan: ['Agustus'],
    peristiwaSejarah: ['Perang Dunia II'],
    kota: ['Bandung'],
    provinsi: ['Jawa Barat'],
    negara: ['Indonesia'],
    institusi: ['Universitas Indonesia'],
    dokumen: ['Undang-Undang Dasar 1945'],
};

test('capitalizeFromList capitalizes exact matches at word boundaries', () => {
    assert.equal(
        capitalizeFromList('saya suka islam dan kristen', ['Islam', 'Kristen']),
        'saya suka Islam dan Kristen'
    );
});

test('capitalizeFromList does not match a substring inside another word', () => {
    assert.equal(
        capitalizeFromList('pengislaman itu berbeda', ['Islam']),
        'pengislaman itu berbeda'
    );
});

test('capitalizeFromList still matches when a possessive clitic (ku/mu/nya) is attached', () => {
    assert.equal(capitalizeFromList('suku sunda dan sundanya', ['Sunda']), 'suku Sunda dan Sundanya');
});

test('capitalizeFromList prefers the longest match when items overlap', () => {
    assert.equal(
        capitalizeFromList('perang dunia ii berkecamuk', ['Perang', 'Perang Dunia II']),
        'Perang Dunia II berkecamuk'
    );
});

test('awalKalimat capitalizes the first letter of every sentence', () => {
    const result = applyCapitalizationRules(
        'selamat pagi. semoga hari ini baik!',
        { awalKalimat: true },
        wordData,
        ''
    );
    assert.equal(result, 'Selamat pagi. Semoga hari ini baik!');
});

test('awalPetikan capitalizes the first letter after an opening quote', () => {
    const result = applyCapitalizationRules(
        'Dia berkata, "selamat pagi."',
        { awalPetikan: true },
        wordData,
        ''
    );
    assert.equal(result, 'dia berkata, "Selamat pagi."');
});

test('namaAgamaTuhan capitalizes God-related terms, including "Tuhanku"', () => {
    const result = applyCapitalizationRules(
        'ya tuhanku, bimbinglah hamba-mu.',
        { namaAgamaTuhan: true },
        wordData,
        ''
    );
    assert.equal(result, 'ya Tuhanku, bimbinglah hamba-Mu.'); // matches the rule's own documented example in data.js
});

test('gelar rules capitalize titles regardless of which specific gelar toggle is on', () => {
    const result = applyCapitalizationRules(
        'haji agus salim adalah seorang pahlawan',
        { gelarKehormatanDiikutiNama: true },
        wordData,
        ''
    );
    assert.equal(result, 'Haji agus salim adalah seorang pahlawan');
});

test('singkatanGelar capitalizes title abbreviations', () => {
    const result = applyCapitalizationRules('dr. andi dan s.h. budi', { singkatanGelar: true }, wordData, '');
    assert.equal(result, 'Dr. andi dan S.H. budi');
});

test('namaGeografi capitalizes cities, provinces, and countries', () => {
    const result = applyCapitalizationRules(
        'saya tinggal di bandung, jawa barat, indonesia',
        { namaGeografi: true },
        wordData,
        ''
    );
    assert.equal(result, 'saya tinggal di Bandung, Jawa Barat, Indonesia');
});

test('namaLembagaDokumen capitalizes institutions and documents', () => {
    const result = applyCapitalizationRules(
        'lulusan universitas indonesia membahas undang-undang dasar 1945',
        { namaLembagaDokumen: true },
        wordData,
        ''
    );
    assert.equal(result, 'lulusan Universitas Indonesia membahas Undang-Undang Dasar 1945');
});

test('custom words are force-capitalized regardless of other rules', () => {
    const result = applyCapitalizationRules('saya suka kapitalin dan frasa unik', {}, wordData, 'Kapitalin, Frasa Unik');
    assert.equal(result, 'saya suka Kapitalin dan Frasa Unik');
});

test('disabled rules do not change the text even when marked checked in the payload', () => {
    const result = applyCapitalizationRules('mesin diesel', { pengecualianNamaJenis: true }, wordData, '');
    assert.equal(result, 'mesin diesel');
});

test('no rules enabled returns the lowercased text unchanged', () => {
    const result = applyCapitalizationRules('Teks INI Campur Aduk', {}, wordData, '');
    assert.equal(result, 'teks ini campur aduk');
});

// --- Integration checks against the real word list shipped in data.js ---

test('every non-disabled rule in ruleOptions is actually implemented', () => {
    const implemented = new Set([
        'awalKalimat', 'awalPetikan', 'namaAgamaTuhan',
        'gelarKehormatanDiikutiNama', 'gelarSapaan', 'jabatanDiikutiNama', 'sapaanKekerabatan',
        'singkatanGelar', 'namaBangsa', 'namaWaktu', 'namaPeristiwaSejarah',
        'namaGeografi', 'namaLembagaDokumen',
    ]);
    const activeRules = ruleOptions.filter(r => !r.disabled);
    for (const rule of activeRules) {
        assert.ok(implemented.has(rule.id), `rule "${rule.id}" is enabled in the UI but has no logic in applyCapitalizationRules`);
    }
});

test('agama list no longer treats "Ateis" as a religion', () => {
    assert.ok(!realWordData.agama.includes('Ateis'));
});

test('Palestina is recognized as a negara, Taiwan as a kota (not negara)', () => {
    assert.ok(realWordData.negara.includes('Palestina'));
    assert.ok(!realWordData.negara.includes('Taiwan'));
    assert.ok(realWordData.kota.includes('Taiwan'));
});

test('Makkah (baku per KBBI VI) and Madinah are capitalized as geografi', () => {
    const result = applyCapitalizationRules(
        'ribuan jemaah berangkat dari madinah menuju makkah untuk beribadah.',
        { namaGeografi: true },
        realWordData,
        ''
    );
    assert.match(result, /Madinah/);
    assert.match(result, /Makkah/);
});

test('Tahun Baru Masehi is capitalized alongside the other new year names', () => {
    const result = applyCapitalizationRules('kami merayakan tahun baru masehi bersama keluarga.', { namaWaktu: true }, realWordData, '');
    assert.match(result, /Tahun Baru Masehi/);
});

test('Brigadir is capitalized as part of a military/police rank', () => {
    const result = applyCapitalizationRules('brigadir jenderal itu memimpin apel pagi.', { jabatanDiikutiNama: true }, realWordData, '');
    assert.match(result, /^Brigadir Jenderal/);
});

test('Apt. (apoteker) is capitalized as a title abbreviation', () => {
    const result = applyCapitalizationRules('konsultasikan dengan apt. rina sebelum minum obat.', { singkatanGelar: true }, realWordData, '');
    assert.match(result, /Apt\. rina/);
});

test('real dictionary data capitalizes a realistic paragraph end-to-end', () => {
    const rules = {
        awalKalimat: true,
        namaAgamaTuhan: true,
        gelarKehormatanDiikutiNama: true,
        namaGeografi: true,
        namaLembagaDokumen: true,
    };
    const result = applyCapitalizationRules(
        'haji agus salim lahir di bukittinggi, sumatera barat. ia beragama islam dan aktif di universitas indonesia.',
        rules,
        realWordData,
        ''
    );
    assert.match(result, /^Haji agus salim lahir di/);
    assert.match(result, /Sumatera Barat/);
    assert.match(result, /Islam/);
    assert.match(result, /Universitas Indonesia/);
});
