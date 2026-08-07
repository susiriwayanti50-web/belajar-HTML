// DATA DEFAULT
const produkAwal = [
    {id: 1, kategori: "sepatu", nama: "Sepatu Sneakers Sekolah", deskripsi: "Sepatu sneakers warna putih dengan bahan kanvas premium dan sol karet empuk. Cocok untuk sekolah dan jalan santai. Tahan lama dan nyaman dipakai seharian.", harga: 180000, coret: 220000, gambar: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500", komentar: [{user:"Budi", text:"Kualitas bagus, nyaman dipake ke sekolah"}, {user:"Ani", text:"Warnanya sesuai gambar, recommended"}]},
    {id: 2, kategori: "sepatu", nama: "Sepatu Olahraga Pria", deskripsi: "Sepatu running ringan dengan teknologi breathable mesh. Sol anti slip cocok untuk lari, gym, dan aktivitas outdoor.", harga: 250000, coret: 300000, gambar: "https://images.unsplash.com/photo-1543508282-6319a3e262ad?w=500", komentar: [{user:"Riko", text:"Ringann banget, cocok buat lari pagi"}]},
    {id: 4, kategori: "baju", nama: "Kaos Oversize", deskripsi: "Kaos oversize bahan cotton 24s adem dan tidak panas. Cutting loose cocok untuk gaya streetwear.", harga: 89000, coret: 110000, gambar: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500", komentar: [{user:"Sinta", text:"Bahannya adem banget"}, {user:"Dewi", text:"Ukuran oversize nya pas"}]},
    {id: 7, kategori: "sekolah", nama: "Tas Ransel Sekolah", deskripsi: "Tas ransel kapasitas 20L dengan banyak kompartemen. Bahan anti air dan tali bahu empuk. Muat laptop 14 inch.", harga: 150000, coret: 200000, gambar: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500", komentar: [{user:"Fajar", text:"Kuat dan banyak kantongnya"}]}
];

let produk = JSON.parse(localStorage.getItem('produkCityShop')) || produkAwal;
let pesanan = JSON.parse(localStorage.getItem('pesanan')) || [];
let keranjang = [];
let userLogin = "";
let produkAktifDetail = null;

// LOGIKA LOGIN & LOGOUT
function login(){
  let u = document.getElementById('username').value.toLowerCase();
  let p = document.getElementById('password').value;

  if(u === "suci" && p === "12345"){
    userLogin = u;
    document.getElementById('loginBox').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'block';
    updateAdminDash();
  } else if(u === "rara" && p === "12345"){
    userLogin = u;
    document.getElementById('loginBox').style.display = 'none';
    document.getElementById('pelangganDashboard').style.display = 'block';
    tampilkanProdukPelanggan();
    loadPesananPelanggan();
  } else {
    document.getElementById('error').innerText = "Username atau Password salah!";
  }
}

function logout(){ location.reload(); }

/* --- SYSTEM ADMIN --- */
function showAdminPage(pageId, el){
  document.querySelectorAll('.admin-subpage').forEach(e => e.style.display = 'none');
  document.querySelectorAll('.admin-menu-item').forEach(e => e.classList.remove('active'));
  if(el) el.classList.add('active');
  document.getElementById(pageId).style.display = 'block';

  if(pageId === 'adminDash') updateAdminDash();
  if(pageId === 'adminView') loadStokAdmin();
  if(pageId === 'adminLaporan') loadLaporanAdmin();
}

function updateAdminDash(){
  document.getElementById('totalBarangText').innerText = "Total Barang: " + produk.length;
}

function tambahBarang(){
  let nama = document.getElementById('namaBarang').value;
  let kat = document.getElementById('kategoriBarang').value;
  let harga = parseInt(document.getElementById('hargaBarang').value);
  let coret = parseInt(document.getElementById('hargaCoretBarang').value) || harga;
  let gambar = document.getElementById('gambarBarang').value || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500";
  let deskripsi = document.getElementById('deskripsiBarang').value;

  if(!nama || !harga){ alert('Isi nama dan harga!'); return; }

  produk.push({ id: Date.now(), kategori: kat, nama: nama, deskripsi: deskripsi, harga: harga, coret: coret, gambar: gambar, komentar: [] });
  localStorage.setItem('produkCityShop', JSON.stringify(produk));
  alert('Barang Berhasil Ditambahkan!');
  ['namaBarang','hargaBarang','hargaCoretBarang','gambarBarang','deskripsiBarang'].forEach(id => document.getElementById(id).value = '');
  showAdminPage('adminView', document.querySelectorAll('.admin-menu-item')[2]);
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
      <td><img src="${p.gambar}" style="width:40px; height:40px; object-fit:cover;"></td>
      <td>${p.nama}</td>
      <td>Rp${p.harga.toLocaleString('id-ID')}</td>
      <td><button style="background:red; color:white; border:none; padding:4px 8px; border-radius:4px; cursor:pointer;" onclick="hapusBarang(${p.id})">Hapus</button></td>
    </tr>`;
  });
  document.getElementById('tabelStokAdmin').innerHTML = html;
}

function loadLaporanAdmin(){
  let total = pesanan.reduce((a,b)=>a+b.total,0);
  document.getElementById('totalPenjualanAdmin').innerText = "Total Penjualan: Rp" + total.toLocaleString('id-ID');
  let html = '';
  pesanan.forEach(p => {
    html += `<tr><td>${p.tanggal}</td><td>${p.pelanggan}</td><td>${p.barang}</td><td>Rp${p.total.toLocaleString('id-ID')}</td></tr>`;
  });
  document.getElementById('tabelLaporanAdmin').innerHTML = html || '<tr><td colspan="4" style="text-align:center;">Belum ada penjualan</td></tr>';
}

/* --- SYSTEM PELANGGAN --- */
function showPelangganPage(pageId){
  document.querySelectorAll('.pelanggan-subpage').forEach(el => el.style.display = 'none');
  document.getElementById(pageId).style.display = 'block';
}

function tampilkanProdukPelanggan(){
  let html = '';
  produk.forEach(p => {
    html += `
    <div class="produk-card">
        <div class="produk-img" onclick="openDetail(${p.id})">
            <div class="badge">Promo</div>
            <img src="${p.gambar}" alt="${p.nama}">
        </div>
        <div class="produk-info">
            <h3 onclick="openDetail(${p.id})">${p.nama}</h3>
            <div class="deskripsi-singkat">${p.deskripsi}</div>
            <div class="harga">Rp${p.harga.toLocaleString('id-ID')} <span>Rp${p.coret.toLocaleString('id-ID')}</span></div>
            <div class="btn-action">
                <button class="btn-keranjang" onclick="tambahKeranjang(${p.id})">+ Keranjang</button>
                <button class="btn-beli" onclick="beliLangsung(${p.id})">Beli</button>
            </div>
        </div>
    </div>`;
  });
  document.getElementById('daftarProduk').innerHTML = html;
}

function openDetail(id){
  produkAktifDetail = produk.find(p => p.id === id);
  if(!produkAktifDetail) return;

  document.getElementById('detailGambar').src = produkAktifDetail.gambar;
  document.getElementById('detailNama').innerText = produkAktifDetail.nama;
  document.getElementById('detailHarga').innerHTML = `Rp${produkAktifDetail.harga.toLocaleString('id-ID')} <span>Rp${produkAktifDetail.coret.toLocaleString('id-ID')}</span>`;
  document.getElementById('detailDeskripsi').innerText = produkAktifDetail.deskripsi;

  let listKom = '';
  (produkAktifDetail.komentar || []).forEach(k => {
    listKom += `<div class="komentar-item"><b>${k.user}</b><p>${k.text}</p></div>`;
  });
  document.getElementById('listKomentar').innerHTML = listKom || '<p style="font-size:12px; color:#888;">Belum ada komentar.</p>';

  document.getElementById('popupDetail').classList.add('show');
}

function closeDetail(){
  document.getElementById('popupDetail').classList.remove('show');
}

/* --- KERANJANG & CHECKOUT --- */
function tambahKeranjang(id) {
  let p = produk.find(item => item.id === id);
  if (!p) return;

  let itemKeranjang = keranjang.find(item => item.id === id);
  if (itemKeranjang) {
    itemKeranjang.qty += 1;
  } else {
    keranjang.push({
      id: p.id,
      nama: p.nama,
      harga: p.harga,
      qty: 1
    });
  }

  updateKeranjangUI();
}

function toggleKeranjang() {
  const popup = document.getElementById('popupKeranjang');
  const overlay = document.getElementById('overlay');
  popup.classList.toggle('show');
  overlay.classList.toggle('show');
}

function updateKeranjangUI() {
  let totalHarga = 0;
  let totalQty = 0;
  let html = '';

  if (keranjang.length === 0) {
    html = '<p style="text-align: center; color: #888; margin: 15px 0;">Keranjang masih kosong</p>';
  } else {
    keranjang.forEach((item, index) => {
      let subtotal = item.harga * item.qty;
      totalHarga += subtotal;
      totalQty += item.qty;

      html += `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #eee;">
          <div style="flex: 1;">
            <div style="font-weight: bold; font-size: 14px;">${item.nama}</div>
            <div style="color: #007bff; font-size: 13px;">Rp${subtotal.toLocaleString('id-ID')}</div>
          </div>
          
          <div style="display: flex; align-items: center; gap: 6px;">
            <button onclick="ubahJumlahItem(${index}, -1)" style="background: #e0e0e0; border: none; width: 24px; height: 24px; border-radius: 4px; font-weight: bold; cursor: pointer;">-</button>
            <span style="font-size: 13px; font-weight: bold;">${item.qty}</span>
            <button onclick="ubahJumlahItem(${index}, 1)" style="background: #e0e0e0; border: none; width: 24px; height: 24px; border-radius: 4px; font-weight: bold; cursor: pointer;">+</button>
            <button onclick="hapusDariKeranjang(${index})" style="background: #ff4d4d; color: white; border: none; padding: 4px 8px; border-radius: 4px; font-size: 11px; cursor: pointer; margin-left: 4px;">🗑️ Hapus</button>
          </div>
        </div>
      `;
    });
  }

  document.getElementById('isiKeranjang').innerHTML = html;
  document.getElementById('totalHarga').innerText = `Total: Rp${totalHarga.toLocaleString('id-ID')}`;
  document.getElementById('jumlahKeranjang').innerText = totalQty;
}

function ubahJumlahItem(index, delta) {
  keranjang[index].qty += delta;
  if (keranjang[index].qty <= 0) {
    keranjang.splice(index, 1);
  }
  updateKeranjangUI();
}

function hapusDariKeranjang(index) {
  keranjang.splice(index, 1);
  updateKeranjangUI();
}

function tambahDariDetail(){
  if(produkAktifDetail){
    tambahKeranjang(produkAktifDetail.id);
    closeDetail();
  }
}

function beliDariDetail(){
  if(produkAktifDetail){
    tambahKeranjang(produkAktifDetail.id);
    closeDetail();
    toggleKeranjang();
  }
}

function beliLangsung(id){
  tambahKeranjang(id);
  toggleKeranjang();
}

function checkout(){
  if(keranjang.length === 0){
    alert('Keranjang Anda masih kosong!');
    return;
  }

  let today = new Date().toISOString().split('T')[0];
  keranjang.forEach(item => {
    pesanan.push({
      tanggal: today,
      pelanggan: userLogin || "Pelanggan",
      barang: `${item.nama} (${item.qty}x)`,
      total: item.harga * item.qty,
      status: "Dikirim"
    });
  });

  localStorage.setItem('pesanan', JSON.stringify(pesanan));
  keranjang = [];
  updateKeranjangUI();
  toggleKeranjang();
  alert('Pembayaran Berhasil! Pesanan sedang diproses.');
  loadPesananPelanggan();
}

function loadPesananPelanggan(){
  let pesananUser = pesanan.filter(p => p.pelanggan === userLogin);
  let htmlPengiriman = '';
  let htmlRiwayat = '';

  pesananUser.forEach(p => {
    htmlPengiriman += `<tr><td>${p.tanggal}</td><td>${p.barang}</td><td>1</td><td><span style="color:green; font-weight:bold;">${p.status}</span></td></tr>`;
    htmlRiwayat += `<tr><td>${p.tanggal}</td><td>${p.barang}</td><td>Rp${p.total.toLocaleString('id-ID')}</td></tr>`;
  });

  document.getElementById('tabelPesananPelanggan').innerHTML = htmlPengiriman || '<tr><td colspan="4" style="text-align:center;">Belum ada pesanan</td></tr>';
  document.getElementById('tabelRiwayatPelanggan').innerHTML = htmlRiwayat || '<tr><td colspan="3" style="text-align:center;">Belum ada riwayat transaksi</td></tr>';
}
