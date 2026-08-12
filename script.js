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

    if (u.toLowerCase() === 'suci' && p === 'suci2345') {
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
    closeProductModal();
}

// Modal Detail Produk
function openProductModal(name, price, desc, imgSrc, videoSrc) {
    document.getElementById('modalTitle').innerText = name;
    document.getElementById('modalPrice').innerText = price;
    document.getElementById('modalDesc').innerText = desc;
    document.getElementById('modalImg').src = imgSrc;

    const modalVid = document.getElementById('modalVideo');
    if (videoSrc) {
        modalVid.src = videoSrc;
        modalVid.style.display = 'block';
    } else {
        modalVid.src = 'https://www.w3schools.com/html/mov_bbb.mp4';
        modalVid.style.display = 'block';
    }
    modalVid.poster = imgSrc;

    const buyBtn = document.getElementById('modalBuyBtn');
    buyBtn.onclick = function() {
        handleBuy(name);
    };

    document.getElementById('productModal').style.display = 'flex';
}

function closeProductModal() {
    const modalVid = document.getElementById('modalVideo');
    modalVid.pause();
    document.getElementById('productModal').style.display = 'none';
}

// Helper membaca file sebagai Data URL
function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
        if (!file) {
            resolve(null);
            return;
        }
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
}

// Handle Tambah Barang oleh Penjual (suci)
document.getElementById('addProductForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const submitBtn = document.getElementById('btnSubmitProduct');
    submitBtn.innerText = "Menyimpan...";
    submitBtn.disabled = true;

    try {
        const name = document.getElementById('pName').value.trim();
        const desc = document.getElementById('pDesc').value.trim();
        const imgFile = document.getElementById('pImgFile').files[0];
        const videoFile = document.getElementById('pVideoFile').files[0];

        if (!imgFile) {
            showToast('Silakan pilih file gambar terlebih dahulu!');
            submitBtn.innerText = "Simpan Produk ke Database";
            submitBtn.disabled = false;
            return;
        }

        // Membaca file gambar dan video secara asinkron (Anti-Stuck)
        const imgSrc = await readFileAsDataURL(imgFile);
        let videoSrc = await readFileAsDataURL(videoFile);
        
        if (!videoSrc) {
            videoSrc = "https://www.w3schools.com/html/mov_bbb.mp4"; // Default demo video jika kosong
        }

        const catalogGrid = document.getElementById('catalogGrid');
        const card = document.createElement('div');
        card.className = 'product-card';

        // Render Kartu Produk Baru
        card.innerHTML = `
            <div class="product-clickable">
                <img src="${imgSrc}" alt="${name}">
                <h3>${name}</h3>
                <div class="product-price">Rp - (Lihat Deskripsi)</div>
                <p class="product-description">${desc}</p>
                <video class="product-video" controls poster="${imgSrc}" onclick="event.stopPropagation();">
                    <source src="${videoSrc}">
                    Browser Anda tidak mendukung pemutaran video demo.
                </video>
            </div>
            <button class="btn-buy">Beli Sekarang</button>
        `;

        // Event listener klik untuk membuka modal
        card.querySelector('.product-clickable').addEventListener('click', function() {
            openProductModal(name, 'Rp - (Lihat Deskripsi)', desc, imgSrc, videoSrc);
        });

        // Event listener klik tombol beli
        card.querySelector('.btn-buy').addEventListener('click', function() {
            handleBuy(name);
        });

        catalogGrid.prepend(card);
        showToast(`Produk "${name}" berhasil ditambahkan ke database!`);
        document.getElementById('addProductForm').reset();

    } catch (error) {
        showToast('Terjadi kesalahan saat mengunggah berkas.');
        console.error(error);
    } finally {
        submitBtn.innerText = "Simpan Produk ke Database";
        submitBtn.disabled = false;
    }
});