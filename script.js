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

    // Jika username "suci" dan password "suci2345" -> Penjual (Admin)
    if (u.toLowerCase() === 'suci' && p === 'suci2345') {
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
    closeProductModal();
}

// Modal Detail Produk
function openProductModal(name, price, desc, imgSrc) {
    document.getElementById('modalTitle').innerText = name;
    document.getElementById('modalPrice').innerText = price;
    document.getElementById('modalDesc').innerText = desc;
    document.getElementById('modalImg').src = imgSrc;
    document.getElementById('modalVideo').poster = imgSrc;

    const buyBtn = document.getElementById('modalBuyBtn');
    buyBtn.onclick = function() {
        handleBuy(name);
    };

    document.getElementById('productModal').style.display = 'flex';
}

function closeProductModal() {
    document.getElementById('productModal').style.display = 'none';
}

// Handle Tambah Barang oleh Penjual (suci) via Upload File Gambar
document.getElementById('addProductForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('pName').value;
    const desc = document.getElementById('pDesc').value;
    const fileInput = document.getElementById('pImgFile');
    const file = fileInput.files[0];

    if (!file) {
        showToast('Pilih gambar terlebih dahulu!');
        return;
    }

    // Membaca file gambar lokal dengan FileReader
    const reader = new FileReader();
    reader.onload = function(event) {
        const imageSrc = event.target.result;
        const catalogGrid = document.getElementById('catalogGrid');
        const card = document.createElement('div');
        card.className = 'product-card';

        // Escaping quote untuk penanganan deskripsi di atribut onclick
        const safeDesc = desc.replace(/'/g, "\\'").replace(/"/g, '&quot;');
        const safeName = name.replace(/'/g, "\\'");

        card.innerHTML = `
            <div class="product-clickable" onclick="openProductModal('${safeName}', 'Rp - (Lihat Deskripsi)', '${safeDesc}', '${imageSrc}')">
                <img src="${imageSrc}" alt="${safeName}">
                <h3>${safeName}</h3>
                <div class="product-price">Rp - (Lihat Deskripsi)</div>
                <p class="product-description">${safeDesc}</p>
                <video class="product-video" controls poster="${imageSrc}" onclick="event.stopPropagation();">
                    <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4">
                    Browser Anda tidak mendukung pemutaran video demo.
                </video>
            </div>
            <button class="btn-buy" onclick="handleBuy('${safeName}')">Beli Sekarang</button>
        `;

        catalogGrid.prepend(card);
        showToast(`Produk "${name}" berhasil ditambahkan ke database!`);
        document.getElementById('addProductForm').reset();
    };

    reader.readAsDataURL(file);
});