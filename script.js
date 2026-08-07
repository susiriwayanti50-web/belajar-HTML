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
  document.querySelectorAll('.admin-subpage').forEach(el => el.style.display = 'none');
  document.querySelectorAll('.admin-menu-item').forEach(el => el.classList.remove('active'));
  el.classList.add('active');
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

  if(!nama ||!harga){ alert('Isi nama dan harga!'); return; }

  produk.push({ id: Date.now(), kategori: kat, nama: nama, deskripsi: deskripsi, harga: harga, coret: coret, gambar: gambar, komentar: [] });
  localStorage.setItem('produkCityShop', JSON.stringify(produk));
  alert('Barang Berhasil Ditambahkan!');
  ['namaBarang','hargaBarang','hargaCoretBarang','gambarBarang','deskripsiBarang'].forEach(id => document.getElementById(id).value = '');
  showAdminPage('adminView', document.querySelectorAll('.admin-menu-item')[2]);
}

function hapusBarang(id){
  produk = produk.filter(p => p.id!== id);
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

  let htmlKom = '';
  produkAktifDetail.komentar.forEach(k => {
    htmlKom += `<div class="komentar-item"><b>${k.user}</b><p>${k.text}</p></div>`;
  });
  document.getElementById('listKomentar').innerHTML = htmlKom || '<p style="font-size:12px; color:#888;">Belum ada komentar</p>';

  document.getElementById('popupDetail').classList.add('show');
}

function closeDetail(){
  document.getElementById('popupDetail').classList.remove('show');
}

function tambahDariDetail(){
  if(produkAktifDetail) tambahKeranjang(produkAktifDetail.id);
  closeDetail();
}

function beliDariDetail(){
  if(produkAktifDetail) beliLangsung(produkAktifDetail.id);
  closeDetail();
}

function tambahKeranjang(id){
  let p = produk.find(item => item.id === id);
  let k = keranjang.find(item => item.id === id);
  if(k) k.jumlah++;
  else keranjang.push({...p, jumlah: 1});
  updateKeranjang();
  alert(p.nama + " masuk keranjang!");
}

function updateKeranjang(){
  document.getElementById('jumlahKeranjang').innerText = keranjang.reduce((a,b)=>a+b.jumlah, 0);
  let html = ''; let total = 0;
  keranjang.forEach(k => {
    total += k.harga * k.jumlah;
    html += `<div style="display:flex; justify-content:space-between; margin-bottom:10px;">
      <div>${k.nama} x${k.jumlah}</div>
      <div>Rp${(k.harga*k.jumlah).toLocaleString('id-ID')}</div>
    </div>`;
  });
  document.getElementById('isiKeranjang').innerHTML = html || 'Kosong';
  document.getElementById('totalHarga').innerText = 'Total: Rp' + total.toLocaleString('id-ID');
}

function toggleKeranjang(){
  document.getElementById('popupKeranjang').classList.toggle('show');
  document.getElementById('overlay').classList.toggle('show');
}

function checkout(){
  if(keranjang.length === 0){ alert('Keranjang kosong!'); return; }
  keranjang.forEach(k => {
    pesanan.push({
      tanggal: new Date().toISOString().split('T')[0],
      pelanggan: userLogin,
      barang: k.nama,
      jumlah: k.jumlah,
      total: k.harga * k.jumlah,
      status: 'Diproses'
    });
  });
  localStorage.setItem('pesanan', JSON.stringify(pesanan));
  alert('Checkout Berhasil!');
  keranjang = [];
  updateKeranjang();
  toggleKeranjang();
  loadPesananPelanggan();
}

function beliLangsung(id){
  let p = produk.find(item => item.id === id);
  pesanan.push({
    tanggal: new Date().toISOString().split('T')[0],
    pelanggan: userLogin,
    barang: p.nama,
    jumlah: 1,
    total: p.harga,
    status: 'Diproses'
  });
  localStorage.setItem('pesanan', JSON.stringify(pesanan));
  alert('Pembelian Berhasil!');
  loadPesananPelanggan();
  showPelangganPage('pengirimanPage');
}

function loadPesananPelanggan(){
  let myOrders = pesanan.filter(p => p.pelanggan === userLogin);
  let htmlP = ''; let htmlR = '';
  myOrders.forEach(p => {
    htmlP += `<tr><td>${p.tanggal}</td><td>${p.barang}</td><td>${p.jumlah}</td><td>${p.status}</td></tr>`;
    htmlR += `<tr><td>${p.tanggal}</td><td>${p.barang}</td><td>Rp${p.total.toLocaleString('id-ID')}</td></tr>`;
  });
  document.getElementById('tabelPesananPelanggan').innerHTML = htmlP || '<tr><td colspan="4" style="text-align:center;">Belum ada pesanan</td></tr>';
  document.getElementById('tabelRiwayatPelanggan').innerHTML = htmlR || '<tr><td colspan="3" style="text-align:center;">Belum ada transaksi</td></tr>';
}