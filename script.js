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
      gambar: p.gambar, // Menyimpan gambar produk
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

      // Layout Card sesuai referensi gambar
      html += `
        <div style="background: #f8f9fa; border-radius: 12px; padding: 12px; margin-bottom: 12px; display: flex; align-items: center; gap: 12px; box-shadow: 0 2px 5px rgba(0,0,0,0.03);">
          <img src="${item.gambar}" style="width: 65px; height: 65px; border-radius: 10px; object-fit: cover;">
          <div style="flex: 1;">
            <div style="font-weight: bold; font-size: 15px; color: #222; margin-bottom: 2px;">${item.nama} ${item.qty > 1 ? `(x${item.qty})` : ''}</div>
            <div style="color: #007bff; font-weight: bold; font-size: 14px; margin-bottom: 4px;">Rp${subtotal.toLocaleString('id-ID')}</div>
            <span onclick="hapusDariKeranjang(${index})" style="color: #dc3545; font-size: 13px; font-weight: 500; cursor: pointer; display: inline-block;">Hapus</span>
          </div>
        </div>
      `;
    });
  }

  document.getElementById('isiKeranjang').innerHTML = html;
  document.getElementById('totalHarga').innerText = `Total: Rp${totalHarga.toLocaleString('id-ID')}`;
  document.getElementById('jumlahKeranjang').innerText = totalQty;
}

function hapusDariKeranjang(index) {
  keranjang.splice(index, 1);
  updateKeranjangUI();
}
