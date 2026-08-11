// Function Toast Notification
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.innerText = message;
    toast.style.display = 'block';
    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}

// Handle Form Login & Routing Role
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const u = document.getElementById('loginUsername').value.trim();
    const p = document.getElementById('loginPassword').value.trim();

    // Jika username "suci" dan password "123" -> Penjual
    if (u.toLowerCase() === 'suci' && p === '123') {
        loginSuccess('suci', 'Penjual (Admin)');
    } else {
        // Bebas Siapa Saja Bisa Masuk Sebagai Pembeli
        loginSuccess(u, 'Pembeli');
    }
});

function loginSuccess(username, role) {
    document.getElementById('loginOverlay').style.display = 'none';
    document.getElementById('displayUser').innerText = username;
    document.getElementById('displayRole').innerText = role;

    // Hanya tampilkan Panel Admin jika role Penjual (suci)
    if (role === 'Penjual (Admin)') {
        document.getElementById('adminPanel').style.display = 'block';
    } else {
        document.getElementById('adminPanel').style.display = 'none';
    }

    showToast(`Selamat datang, ${username}!`);
}

// Handle Logout
document.getElementById('btnLogout').addEventListener('click', function() {
    document.getElementById('loginOverlay').style.display = 'flex';
    document.getElementById('loginForm').reset();
    showToast('Berhasil keluar dari akun.');
});

// Handle Tombol Beli Sekarang
function handleBuy(productName) {
    const currentUser = document.getElementById('displayUser').innerText;
    const orderList = document.getElementById('orderList');
    const randomId = '#ORD-' + Math.floor(1000 + Math.random() * 9000);

    const buyerName = (currentUser === 'Pengguna') ? 'Pembeli Baru' : currentUser;

    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td>${randomId}</td>
        <td>${productName}</td>
        <td>${buyerName}</td>
        <td><span class="status-badge status-unpaid">Pesanan Belum Dibayar</span></td>
    `;

    orderList.prepend(tr);
    showToast(`Pesanan ${productName} berhasil dibuat oleh ${buyerName}!`);
}

// Handle Tambah Barang oleh Penjual (suci)
document.getElementById('addProductForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('pName').value;
    const desc = document.getElementById('pDesc').value;
    const img = document.getElementById('pImg').value;

    const catalogGrid = document.getElementById('catalogGrid');
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <div>
            <img src="${img}" alt="${name}" onerror="this.src='https://via.placeholder.com/600x400?text=Gambar+Gadget'">
            <h3>${name}</h3>
            <div class="product-price">Rp - (Lihat Deskripsi)</div>
            <p class="product-description">${desc}</p>
            <video class="product-video" controls poster="${img}">
                <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4">
                Browser Anda tidak mendukung pemutaran video demo.
            </video>
        </div>
        <button class="btn-buy" onclick="handleBuy('${name}')">Beli Sekarang</button>
    `;

    catalogGrid.prepend(card);
    showToast(`Produk "${name}" berhasil ditambahkan ke database!`);
    this.reset();
});
