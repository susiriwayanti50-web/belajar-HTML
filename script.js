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

    if (u.toLowerCase() === 'suci' && p === '123') {
        loginSuccess('suci', 'Penjual (Admin)');
    } else {
        loginSuccess(u, 'Pembeli');
    }
});

function loginSuccess(username, role) {
    document.getElementById('loginOverlay').style.display = 'none';
    document.getElementById('displayUser').innerText = username;
    document.getElementById('displayRole').innerText = role;

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

// Handle Tambah Barang via File Upload oleh Penjual (suci)
document.getElementById('addProductForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('pName').value;
    const desc = document.getElementById('pDesc').value;
    
    const imgInput = document.getElementById('pImg');
    const videoInput = document.getElementById('pVideo');

    // Menandai URL sementara dari file lokal yang di-upload
    const imgFile = imgInput.files[0];
    const imgUrl = imgFile ? URL.createObjectURL(imgFile) : '';

    const videoFile = videoInput.files[0];
    const videoUrl = videoFile ? URL.createObjectURL(videoFile) : '';

    let mediaHTML = `<img src="${imgUrl}" alt="${name}">`;

    if (videoUrl) {
        mediaHTML += `
            <video class="product-video" controls>
                <source src="${videoUrl}" type="${videoFile.type}">
                Browser Anda tidak mendukung pemutaran video demo.
            </video>
        `;
    }

    const catalogGrid = document.getElementById('catalogGrid');
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <div>
            ${mediaHTML}
            <h3>${name}</h3>
            <div class="product-price">Rp - (Lihat Deskripsi)</div>
            <p class="product-description">${desc}</p>
        </div>
        <button class="btn-buy" onclick="handleBuy('${name}')">Beli Sekarang</button>
    `;

    catalogGrid.prepend(card);
    showToast(`Produk "${name}" berhasil ditambahkan!`);
    this.reset();
});
