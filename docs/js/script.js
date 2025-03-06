document.addEventListener('DOMContentLoaded', function() {
    // --- Menu Burger ---
    const burgerButton = document.querySelector('.menu-burger');
    const menuNav = document.querySelector('.menu-nav');

    burgerButton.addEventListener('click', () => {
        burgerButton.classList.toggle('active');
        menuNav.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    });

    // --- Waktu (menggunakan requestAnimationFrame) ---
    function displayTime(id, offset) {
        const element = document.getElementById(id);
        function update() {
            const now = new Date();
            const time = new Date(now.getTime() + offset * 60 * 60 * 1000);
            const options = { hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short' };
            element.querySelector('span').textContent = time.toLocaleTimeString('id-ID', options);
            requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    }

    displayTime('clock-wib', 7);
    displayTime('clock-wita', 8);

    // --- Fungsi Validasi (diperbaiki) ---
    function validateForm(data) {
        const errors = [];
        if (!data.nama.trim()) errors.push("Nama Karyawan harus diisi.");
        if (!data.divisi.trim()) errors.push("Divisi harus dipilih.");
        if (!isValidDate(data.tanggal)) errors.push("Tanggal harus valid (YYYY-MM-DD).");
        if (!isValidTime(data.jam_masuk)) errors.push("Jam Masuk harus valid (HH:mm).");
        if (!isValidTime(data.jam_keluar)) errors.push("Jam Keluar harus valid (HH:mm).");
        return errors;
    }

    function isValidDate(dateString) {
        return !isNaN(Date.parse(dateString));
    }

    function isValidTime(timeString) {
        return /^\d{2}:\d{2}$/.test(timeString);
    }


    // --- Menampilkan Pesan Error (diperbaiki) ---
    function displayErrors(errors, formId) {
        const errorContainer = document.getElementById(`${formId}-errors`);
        errorContainer.innerHTML = '';
        if (errors.length > 0) {
            const errorList = document.createElement('ul');
            errors.forEach(error => {
                const item = document.createElement('li');
                item.textContent = error;
                errorList.appendChild(item);
            });
            errorContainer.appendChild(errorList);
            errorContainer.style.display = 'block';
        } else {
            errorContainer.style.display = 'none';
        }
    }

    // --- Fungsi untuk memproses data absensi ---
    function processAbsensiData(data, formId) {
        const errors = validateForm(data);
        displayErrors(errors, formId);
        if (errors.length > 0) return;

        // Simpan data absensi di localStorage (ganti dengan pengiriman ke server)
        let absensiData = JSON.parse(localStorage.getItem('absensiData')) || [];
        absensiData.push(data);
        localStorage.setItem('absensiData', JSON.stringify(absensiData));

        updateAttendanceSummary();
        alert('Data absensi berhasil dikirim!');
        document.getElementById(formId).reset();
    }

    // --- Fungsi untuk memperbarui ringkasan kehadiran ---
    function updateAttendanceSummary() {
        const absensiData = JSON.parse(localStorage.getItem('absensiData')) || [];
        const summaryTable = document.querySelector('#summary-table tbody');
        summaryTable.innerHTML = '';

        if (absensiData.length === 0) {
            const row = summaryTable.insertRow();
            const cell = row.insertCell();
            cell.colSpan = 9;
            cell.textContent = "Belum ada data absensi.";
            return;
        }

        absensiData.forEach(absensi => {
            const row = summaryTable.insertRow();
            Object.values(absensi).forEach(value => {
                const cell = row.insertCell();
                cell.textContent = value;
            });
        });
    }

    // --- Event listener untuk form absensi ---
    const absensiForm = document.getElementById('absensi-form');
    absensiForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(this);
        const data = {};
        formData.forEach((value, key) => data[key] = value);
        const errors = validateForm(data);
        if (errors.length > 0) {
            displayErrors(errors, 'absensi-form');
            return;
        }
        processAbsensiData(data, 'absensi-form');
    });

    // --- Event listener untuk form izin darurat ---
    const izinDaruratForm = document.getElementById('izin-darurat-form');
    izinDaruratForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(this);
        const data = {};
        formData.forEach((value, key) => data[key] = value);

        const errors = validateForm(data);
        displayErrors(errors, 'izin-darurat-form');
        if (errors.length > 0) return;

        console.log('Data Izin Darurat:', data);
        alert('Izin darurat berhasil dikirim!');
        document.getElementById('izin-darurat-form').reset();
    });

    // --- Custom Divisi Selection ---
    const divisiSelect = document.getElementById('divisi');
    const divisiOptions = ['Divisi A', 'Divisi B', 'Divisi C', 'Divisi D'];
    divisiOptions.forEach(option => {
        const el = document.createElement('option');
        el.textContent = option;
        el.value = option;
        divisiSelect.appendChild(el);
    });
});
