// DATA DEFAULT INVENTARIS
const produkAwal = [
    {id: 1, kategori: "sepatu", nama: "Sepatu Sneakers Sekolah", deskripsi: "Warna putih, sol empuk", harga: 180000, coret: 220000, stok: 15, gambar: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500"},
    {id: 2, kategori: "sepatu", nama: "Sepatu Olahraga Pria", deskripsi: "Buat lari dan gym", harga: 250000, coret: 300000, stok: 10, gambar: "https://images.unsplash.com/photo-1543508282-6319a3e262ad?w=500"},
    {id: 4, kategori: "baju", nama: "Oversize Shirt", deskripsi: "Bahan cotton 24s", harga: 89000, coret: 110000, stok: 25, gambar: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500"},
    {id: 7, kategori: "sekolah", nama: "Tas Ransel Sekolah", deskripsi: "Kapasitas 20L muat banyak buku", harga: 150000, coret: 200000, stok: 8, gambar: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500"}
];

let produk = JSON.parse(localStorage.getItem('produkCityShop')) || produkAwal;
let pesanan = JSON.parse(localStorage.getItem('pesanan')) || [];
let pasokanList = JSON.parse(localStorage.getItem('pasokanList')) || [];
let keranjang = JSON.parse(localStorage.getItem('keranjang')) || [];
let userLogin = localStorage.getItem('userLogin') || "";
let itemCheckoutSementara = [];

// CEK SESI USER SAAT HALAMAN DIMUAT
document.addEventListener('DOMContentLoaded', function() {
  if (userLogin === "suci") {
    document.getElementById('loginBox').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'block';
    updateAdminDash();
  } else if (userLogin !== "") {
    document.getElementById('loginBox').style.display = 'none';
    document.getElementById('pelangganDashboard').style.display = 'block';
    showPelangganPage('tokoPage');
    updateKeranjang();
  }
});

// FUNGSI LOGIN (TIDAK AKAN STUCK)
function login(){
  let u = document.getElementById('username').value.trim();
  let p = document.getElementById('password').value.trim();

  if(!u || !p) {
    document.getElementById('error').innerText = "Username dan password tidak boleh kosong!";
    return;
  }

  document.getElementById('error').innerText = "";
  userLogin = u;
  localStorage.setItem('userLogin', u);
  document.getElementById('loginBox').style.display = 'none';

  if(u.toLowerCase() === "suci" && p === "12345"){
    document.getElementById('adminDashboard').style.display = 'block';
    showAdminPage('adminDash');
  } else {
    document.getElementById('pelangganDashboard').style.display = 'block';
    showPelangganPage('tokoPage');
    updateKeranjang();
  }
}

function logout(){ 
  localStorage.removeItem('userLogin');
  location.reload(); 
}

/* --- SYSTEM ADMIN --- */
function showAdminPage(pageId){
  document.querySelectorAll('.admin-subpage').forEach(el => el.style.display = 'none');
  let target = document.getElementById(pageId);
  if(target) target.style.display = 'block';
  
  if(pageId === 'adminDash') updateAdminDash();
  if(pageId === 'adminView') loadStokAdmin();
  if(pageId === 'adminSetor') loadPasokanAdmin();
  if(pageId === 'adminLaporan') loadLaporanAdmin();
}

function updateAdminDash(){
  document.getElementById('totalBarangText').innerText = "Total Jenis Barang: " + produk.length;
  let totalStok = produk.reduce((a, b) => a + (parseInt(b.stok) || 0), 0);
  document.getElementById('totalStokText').innerText = "Total Unit Stok Keseluruhan: " + totalStok;
}

function simpanBarang(){
  let id = document.getElementById('editBarangId').value;
  let nama = document.getElementById('namaBarang').value;
  let kat = document.getElementById('kategoriBarang').value;
  let harga = parseInt(document.getElementById('hargaBarang').value);
  let coret = parseInt(document.getElementById('hargaCoretBarang').value) || harga;
  let stok = parseInt(document.getElementById('stokBarang').value) || 0;
  let gambar = document.getElementById('gambarBarang').value || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500";
  let deskripsi = document.getElementById('deskripsiBarang').value;

  if(!nama || isNaN(harga)){ return; }

  if(id) {
    let index = produk.findIndex(p => p.id == id);
    if(index !== -1) {
      produk[index] = { id: parseInt(id), kategori: kat, nama: nama, deskripsi: deskripsi, harga: harga, coret: coret, stok: stok, gambar: gambar };
    }
  } else {
    produk.push({ id: Date.now(), kategori: kat, nama: nama, deskripsi: deskripsi, harga: harga, coret: coret, stok: stok, gambar: gambar });
  }

  localStorage.setItem('produkCityShop', JSON.stringify(produk));
  resetFormBarang();
  showAdminPage('adminView');
}

function editBarang(id){
  let item = produk.find(p => p.id === id);
  if(!item) return;

  document.getElementById('editBarangId').value = item.id;
  document.getElementById('namaBarang').value = item.nama;
  document.getElementById('kategoriBarang').value = item.kategori;
  document.getElementById('hargaBarang').value = item.harga;
  document.getElementById('hargaCoretBarang').value = item.coret;
  document.getElementById('stokBarang').value = item.stok;
  document.getElementById('gambarBarang').value = item.gambar;
  document.getElementById('deskripsiBarang').value = item.deskripsi;

  document.getElementById('judulFormBarang').innerText = "Edit Data Barang";
  document.getElementById('btnBatalEditBarang').style.display = "inline-block";
  showAdminPage('adminInput');
}

function resetFormBarang(){
  document.getElementById('editBarangId').value = "";
  document.getElementById('namaBarang').value = "";
  document.getElementById('hargaBarang').value = "";
  document.getElementById('hargaCoretBarang').value = "";
  document.getElementById('stokBarang').value = "";
  document.getElementById('gambarBarang').value = "";
  document.getElementById('deskripsiBarang').value = "";
  document.getElementById('judulFormBarang').innerText = "Input Barang Baru";
  document.getElementById('btnBatalEditBarang').style.display = "none";
}

function hapusBarang(id){
  produk = produk.filter(p => p.id !== id);
  localStorage.setItem('produkCityShop', JSON.stringify(produk));
  loadStokAdmin();
  updateAdminDash();
}

function loadStokAdmin(){
  let html = '';
  produk.forEach(p => {
    html += `<tr>
      <td><img src="${p.gambar}" style="width:40px; height:40px; object-fit:cover; border-radius:4px;"></td>
      <td><b>${p.nama}</b></td>
      <td>${p.kategori}</td>
      <td>Rp${p.harga.toLocaleString('id-ID')}</td>
      <td><b>${p.stok}</b></td>
      <td>
        <button type="button" class="btn-edit-item" onclick="editBarang(${p.id})">Edit</button>
        <button type="button" class="btn-hapus-item" onclick="hapusBarang(${p.id})">Hapus</button>
      </td>
    </tr>`;
  });
  document.getElementById('tabelStokAdmin').innerHTML = html || '<tr><td colspan="6" style="text-align:center;">Tidak ada barang</td></tr>';
}

function loadPasokanAdmin(){
  let select = document.getElementById('pasokanBarangId');
  select.innerHTML = '<option value="">-- Pilih Barang --</option>';
  produk.forEach(p => {
    select.innerHTML += `<option value="${p.id}">${p.nama} (Stok Saat Ini: ${p.stok})</option>`;
  });

  let html = '';
  pasokanList.forEach(pas => {
    html += `<tr>
      <td>${pas.tanggal}</td>
      <td>${pas.namaBarang}</td>
      <td>+${pas.jumlah}</td>
      <td>Rp${pas.totalHarga.toLocaleString('id-ID')}</td>
      <td>
        <button type="button" class="btn-edit-item" onclick="editPasokan(${pas.id})">Edit</button>
        <button type="button" class="btn-hapus-item" onclick="hapusPasokan(${pas.id})">Hapus</button>
      </td>
    </tr>`;
  });
  document.getElementById('tabelPasokanAdmin').innerHTML = html || '<tr><td colspan="5" style="text-align:center;">Belum ada riwayat pasokan</td></tr>';
}

function simpanPasokan(){
  let pasokanId = document.getElementById('editPasokanId').value;
  let barangId = parseInt(document.getElementById('pasokanBarangId').value);
  let jumlahBaru = parseInt(document.getElementById('pasokanJumlah').value);
  let totalHarga = parseInt(document.getElementById('pasokanTotalHarga').value) || 0;

  if(!barangId || isNaN(jumlahBaru) || jumlahBaru <= 0){ return; }

  let itemBarang = produk.find(p => p.id === barangId);
  if(!itemBarang) return;

  if(pasokanId){
    let pas = pasokanList.find(p => p.id == pasokanId);
    let selisihStok = jumlahBaru - pas.jumlah;
    
    itemBarang.stok += selisihStok;
    pas.barangId = barangId;
    pas.namaBarang = itemBarang.nama;
    pas.jumlah = jumlahBaru;
    pas.totalHarga = totalHarga;
  } else {
    itemBarang.stok += jumlahBaru;
    pasokanList.push({
      id: Date.now(),
      tanggal: new Date().toISOString().split('T')[0],
      barangId: barangId,
      namaBarang: itemBarang.nama,
      jumlah: jumlahBaru,
      totalHarga: totalHarga
    });
  }

  localStorage.setItem('produkCityShop', JSON.stringify(produk));
  localStorage.setItem('pasokanList', JSON.stringify(pasokanList));
  resetFormPasokan();
  loadPasokanAdmin();
}

function editPasokan(id){
  let pas = pasokanList.find(p => p.id === id);
  if(!pas) return;

  document.getElementById('editPasokanId').value = pas.id;
  document.getElementById('pasokanBarangId').value = pas.barangId;
  document.getElementById('pasokanJumlah').value = pas.jumlah;
  document.getElementById('pasokanTotalHarga').value = pas.totalHarga;
  document.getElementById('btnBatalPasokan').style.display = "inline-block";
}

function resetFormPasokan(){
  document.getElementById('editPasokanId').value = "";
  document.getElementById('pasokanBarangId').value = "";
  document.getElementById('pasokanJumlah').value = "";
  document.getElementById('pasokanTotalHarga').value = "";
  document.getElementById('btnBatalPasokan').style.display = "none";
}

function hapusPasokan(id){
  let pas = pasokanList.find(p => p.id === id);
  if(pas){
    let itemBarang = produk.find(p => p.id === pas.barangId);
    if(itemBarang) itemBarang.stok = Math.max(0, itemBarang.stok - pas.jumlah);
    
    pasokanList = pasokanList.filter(p => p.id !== id);
    localStorage.setItem('produkCityShop', JSON.stringify(produk));
    localStorage.setItem('pasokanList', JSON.stringify(pasokanList));
    loadPasokanAdmin();
  }
}

function loadLaporanAdmin(){
  let total = pesanan.reduce((a,b)=>a+b.total,0);
  document.getElementById('totalPenjualanAdmin').innerText = "Total Penjualan: Rp" + total.toLocaleString('id-ID');
  let html = '';
  pesanan.forEach((p, index) => {
    html += `<tr>
      <td>${p.tanggal}</td>
      <td>${p.pelanggan}</td>
      <td>${p.telepon || '-'}</td>
      <td>${p.barang} (${p.jumlah}x)</td>
      <td>Rp${p.total.toLocaleString('id-ID')}</td>
      <td>
        <select onchange="ubahStatusPesanan(${index}, this.value)" style="padding:4px; border-radius:4px;">
          <option value="Sedang Dikemas" ${p.status === 'Sedang Dikemas' ? 'selected' : ''}>Sedang Dikemas</option>
          <option value="Masih Dikirim" ${p.status === 'Masih Dikirim' ? 'selected' : ''}>Masih Dikirim</option>
          <option value="Sudah Diterima" ${p.status === 'Sudah Diterima' ? 'selected' : ''}>Sudah Diterima</option>
        </select>
      </td>
    </tr>`;
  });
  document.getElementById('tabelLaporanAdmin').innerHTML = html || '<tr><td colspan="6" style="text-align:center;">Belum ada penjualan</td></tr>';
}

function ubahStatusPesanan(index, statusBaru){
  pesanan[index].status = statusBaru;
  localStorage.setItem('pesanan', JSON.stringify(pesanan));
}

/* --- SYSTEM PELANGGAN --- */
function showPelangganPage(pageId){
  document.querySelectorAll('.pelanggan-subpage').forEach(el => el.style.display = 'none');
  let target = document.getElementById(pageId);
  if(target) target.style.display = 'block';

  if(pageId === 'tokoPage') tampilkanProdukPelanggan();
  if(pageId === 'pengirimanPage' || pageId === 'laporanPelangganPage') loadPesananPelanggan();
}

function tampilkanProdukPelanggan(){
  let html = '';
  produk.forEach(p => {
    let habis = p.stok <= 0;
    html += `
    <div class="produk-card">
        <div class="produk-img">
            <div class="badge">Promo</div>
            <div class="stok-badge">Stok: ${p.stok}</div>
            <img src="${p.gambar}" alt="${p.nama}">
        </div>
        <div class="produk-info">
            <h3>${p.nama}</h3>
            <div class="deskripsi-singkat">${p.deskripsi}</div>
            <div class="harga">Rp${p.harga.toLocaleString('id-ID')} <span>Rp${p.coret.toLocaleString('id-ID')}</span></div>
            <div class="btn-action">
                <button type="button" class="btn-keranjang ${habis ? 'btn-disabled' : ''}" ${habis ? 'disabled' : ''} onclick="tambahKeranjang(${p.id})">${habis ? 'Habis' : '+ Keranjang'}</button>
                <button type="button" class="btn-beli ${habis ? 'btn-disabled' : ''}" ${habis ? 'disabled' : ''} onclick="beliLangsung(${p.id})">${habis ? 'Habis' : 'Beli'}</button>
            </div>
        </div>
    </div>`;
  });
  document.getElementById('daftarProduk').innerHTML = html;
}

function tambahKeranjang(id){
  let p = produk.find(item => item.id === id);
  let k = keranjang.find(item => item.id === id);
  let jmlKeranjang = k ? k.jumlah : 0;

  if(p.stok <= jmlKeranjang) return;

  if(k) k.jumlah++;
  else keranjang.push({...p, jumlah: 1});
  
  updateKeranjang();
}

function hapusKeranjang(id){
  keranjang = keranjang.filter(item => item.id !== id);
  updateKeranjang();
}

function updateKeranjang(){
  localStorage.setItem('keranjang', JSON.stringify(keranjang));
  document.getElementById('jumlahKeranjang').innerText = keranjang.reduce((a,b)=>a+b.jumlah, 0);
  let html = ''; let total = 0;
  
  if(keranjang.length === 0){
    html = '<p style="text-align:center; color:#888; padding:10px 0;">Keranjang Kosong</p>';
  } else {
    keranjang.forEach(k => {
      total += k.harga * k.jumlah;
      html += `
      <div class="item-keranjang">
        <div>
          <div style="font-weight:bold; font-size:14px;">${k.nama}</div>
          <div style="font-size:12px; color:#555;">${k.jumlah} x Rp${k.harga.toLocaleString('id-ID')}</div>
        </div>
        <button type="button" class="btn-hapus-item" onclick="hapusKeranjang(${k.id})">Hapus</button>
      </div>`;
    });
  }
  
  document.getElementById('isiKeranjang').innerHTML = html;
  document.getElementById('totalHarga').innerText = 'Total: Rp' + total.toLocaleString('id-ID');
}

function toggleKeranjang(){
  document.getElementById('popupKeranjang').classList.toggle('show');
  document.getElementById('overlay').classList.toggle('show');
}

/* --- CHECKOUT --- */
function bukaHalamanCheckout() {
  if(keranjang.length === 0) return;
  itemCheckoutSementara = [...keranjang];
  tampilkanDetailCheckout();
  toggleKeranjang();
  showPelangganPage('checkoutPage');
}

function beliLangsung(id){
  let p = produk.find(item => item.id === id);
  if(!p || p.stok <= 0) return;
  
  itemCheckoutSementara = [{...p, jumlah: 1}];
  tampilkanDetailCheckout();
  showPelangganPage('checkoutPage');
}

function tampilkanDetailCheckout() {
  let html = '';
  let total = 0;
  itemCheckoutSementara.forEach(item => {
    let subtotal = item.harga * item.jumlah;
    total += subtotal;
    html += `
      <div style="display:flex; justify-content:space-between; margin-bottom: 5px; font-size:14px;">
        <span>${item.nama} (${item.jumlah}x)</span>
        <b>Rp${subtotal.toLocaleString('id-ID')}</b>
      </div>
    `;
  });
  document.getElementById('ringkasanCheckout').innerHTML = html;
  document.getElementById('totalCheckoutText').innerText = "Total: Rp" + total.toLocaleString('id-ID');
}

function prosesKonfirmasiCheckout() {
  let telp = document.getElementById('teleponCheckout').value.trim();
  let alamat = document.getElementById('alamatCheckout').value.trim();
  
  if(!telp || !alamat) return;

  itemCheckoutSementara.forEach(k => {
    let p = produk.find(item => item.id === k.id);
    if(p) {
      p.stok = Math.max(0, p.stok - k.jumlah);
    }

    pesanan.push({
      id: Date.now() + Math.random(),
      tanggal: new Date().toISOString().split('T')[0],
      pelanggan: userLogin,
      telepon: telp,
      alamat: alamat,
      barang: k.nama,
      jumlah: k.jumlah,
      total: k.harga * k.jumlah,
      status: 'Sedang Dikemas'
    });
  });

  keranjang = keranjang.filter(k => !itemCheckoutSementara.some(item => item.id === k.id));
  
  localStorage.setItem('produkCityShop', JSON.stringify(produk));
  localStorage.setItem('pesanan', JSON.stringify(pesanan));
  updateKeranjang();
  
  document.getElementById('teleponCheckout').value = '';
  document.getElementById('alamatCheckout').value = '';
  loadPesananPelanggan();
  showPelangganPage('pengirimanPage');
}

function terimaBarang(idPesanan) {
  let p = pesanan.find(item => item.id === idPesanan);
  if(p) {
    p.status = 'Sudah Diterima';
    localStorage.setItem('pesanan', JSON.stringify(pesanan));
    loadPesananPelanggan();
  }
}

function loadPesananPelanggan(){
  let myOrders = pesanan.filter(p => p.pelanggan === userLogin);
  let htmlP = ''; let htmlR = '';

  myOrders.forEach(p => {
    let badgeClass = 'status-kemas';
    if(p.status === 'Masih Dikirim') badgeClass = 'status-kirim';
    if(p.status === 'Sudah Diterima') badgeClass = 'status-terima';

    let tombolTerima = p.status !== 'Sudah Diterima' 
      ? `<button type="button" class="btn-beli" style="padding:4px 8px; font-size:10px;" onclick="terimaBarang(${p.id})">Terima Barang</button>`
      : `<span style="color:green; font-weight:bold; font-size:11px;">Selesai</span>`;

    htmlP += `<tr>
      <td>${p.tanggal}</td>
      <td>${p.barang}</td>
      <td>${p.jumlah}</td>
      <td><span class="status-badge ${badgeClass}">${p.status}</span></td>
      <td>${tombolTerima}</td>
    </tr>`;

    htmlR += `<tr>
      <td>${p.tanggal}</td>
      <td>${p.barang}</td>
      <td>Rp${p.total.toLocaleString('id-ID')}</td>
      <td><span class="status-badge ${badgeClass}">${p.status}</span></td>
    </tr>`;
  });

  document.getElementById('tabelPesananPelanggan').innerHTML = htmlP || '<tr><td colspan="5" style="text-align:center;">Belum ada pesanan</td></tr>';
  document.getElementById('tabelRiwayatPelanggan').innerHTML = htmlR || '<tr><td colspan="4" style="text-align:center;">Belum ada transaksi</td></tr>';
}
