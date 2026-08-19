// Mengambil data dari localStorage atau inisialisasi awal
let dataBarang = JSON.parse(localStorage.getItem('dataBarang')) || [
    { id: 1, nama: "Buku Tulis", harga: 5000, stok: 20 },
    { id: 2, nama: "Pulpen", harga: 3000, stok: 50 }
];

let dataPembelian = JSON.parse(localStorage.getItem('dataPembelian')) || [];

// Fungsi simpan ke localStorage
function saveStorage() {
    localStorage.setItem('dataBarang', JSON.stringify(dataBarang));
    localStorage.setItem('dataPembelian', JSON.stringify(dataPembelian));
    renderAll();
}

// --- LOGIC BARANG ---
function renderBarang() {
    const tbody = document.getElementById('tabel-barang');
    const selectBarang = document.getElementById('pembelian-barang-id');
    
    tbody.innerHTML = '';
    selectBarang.innerHTML = '<option value="">-- Pilih Barang --</option>';

    dataBarang.forEach(b => {
        // Table View
        tbody.innerHTML += `
            <tr>
                <td>${b.id}</td>
                <td>${b.nama}</td>
                <td>Rp ${b.harga.toLocaleString()}</td>
                <td>${b.stok}</td>
                <td><button class="btn-edit" onclick="editBarang(${b.id})">Edit</button></td>
            </tr>
        `;

        // Populate Dropdown Pembelian
        selectBarang.innerHTML += `<option value="${b.id}">${b.nama} (Rp ${b.harga.toLocaleString()} \vert{} Stok:${b.stok})</option>`;
    });
}

document.getElementById('form-barang').addEventListener('submit', function(e) {
    e.preventDefault();
    const id = document.getElementById('barang-id').value;
    const nama = document.getElementById('barang-nama').value;
    const harga = parseInt(document.getElementById('barang-harga').value);
    const stok = parseInt(document.getElementById('barang-stok').value);

    if (id) {
        // EDIT BARANG
        const item = dataBarang.find(b => b.id == id);
        item.nama = nama;
        item.harga = harga;
        item.stok = stok;
    } else {
        // INPUT BARANG
        const newId = dataBarang.length ? Math.max(...dataBarang.map(b => b.id)) + 1 : 1;
        dataBarang.push({ id: newId, nama, harga, stok });
    }

    resetFormBarang();
    saveStorage();
});

function editBarang(id) {
    const b = dataBarang.find(item => item.id === id);
    document.getElementById('barang-id').value = b.id;
    document.getElementById('barang-nama').value = b.nama;
    document.getElementById('barang-harga').value = b.harga;
    document.getElementById('barang-stok').value = b.stok;
    document.getElementById('btn-batal-barang').style.display = 'inline-block';
}

function resetFormBarang() {
    document.getElementById('form-barang').reset();
    document.getElementById('barang-id').value = '';
    document.getElementById('btn-batal-barang').style.display = 'none';
}

// --- LOGIC PEMBELIAN ---
function renderPembelian() {
    const tbody = document.getElementById('tabel-pembelian');
    tbody.innerHTML = '';

    dataPembelian.forEach(p => {
        const barang = dataBarang.find(b => b.id === p.barangId);
        const namaBarang = barang ? barang.nama : 'Barang Dihapus';
        tbody.innerHTML += `
            <tr>
                <td>${p.id}</td>
                <td>${namaBarang}</td>
                <td>${p.jumlah}</td>
                <td>Rp ${p.totalHarga.toLocaleString()}</td>
                <td><button class="btn-edit" onclick="editPembelian(${p.id})">Edit</button></td>
            </tr>
        `;
    });
}

document.getElementById('form-pembelian').addEventListener('submit', function(e) {
    e.preventDefault();
    const id = document.getElementById('pembelian-id').value;
    const barangId = parseInt(document.getElementById('pembelian-barang-id').value);
    const jumlahBaru = parseInt(document.getElementById('pembelian-jumlah').value);

    const barang = dataBarang.find(b => b.id === barangId);

    if (id) {
        // EDIT PEMBELIAN
        const p = dataPembelian.find(item => item.id == id);
        const selisih = jumlahBaru - p.jumlah;

        if (barang.stok >= selisih) {
            barang.stok -= selisih;
            p.barangId = barangId;
            p.jumlah = jumlahBaru;
            p.totalHarga = barang.harga * jumlahBaru;
        } else {
            alert('Stok tidak cukup!');
            return;
        }
    } else {
        // INPUT PEMBELIAN BARU
        if (barang.stok >= jumlahBaru) {
            barang.stok -= jumlahBaru;
            const newId = dataPembelian.length ? Math.max(...dataPembelian.map(p => p.id)) + 1 : 1;
            dataPembelian.push({
                id: newId,
                barangId: barangId,
                jumlah: jumlahBaru,
                totalHarga: barang.harga * jumlahBaru
            });
        } else {
            alert('Stok tidak mencukupi!');
            return;
        }
    }

    resetFormPembelian();
    saveStorage();
});

function editPembelian(id) {
    const p = dataPembelian.find(item => item.id === id);
    document.getElementById('pembelian-id').value = p.id;
    document.getElementById('pembelian-barang-id').value = p.barangId;
    document.getElementById('pembelian-jumlah').value = p.jumlah;
    document.getElementById('btn-batal-pembelian').style.display = 'inline-block';
}

function resetFormPembelian() {
    document.getElementById('form-pembelian').reset();
    document.getElementById('pembelian-id').value = '';
    document.getElementById('btn-batal-pembelian').style.display = 'none';
}

function renderAll() {
    renderBarang();
    renderPembelian();
}

// Inisialisasi awal
renderAll();
