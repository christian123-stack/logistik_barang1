// Cek apakah pengguna sudah login
let currentUser = localStorage.getItem('currentUser');
if (!currentUser) {
  window.location.href = 'login.html';  // Jika belum login, redirect ke halaman login
} else {
  showMainPage(currentUser);
}

// Fungsi untuk menampilkan data barang pada tabel
function showMainPage(username) {
  loadBarang(username);
}

// Event listener untuk menambah barang
document.getElementById('barangForm').addEventListener('submit', function(e) {
  e.preventDefault();

  let namaBarang = document.getElementById('barangNama').value;
  let jumlah = document.getElementById('jumlah').value;
  let kadaluarsa = new Date(document.getElementById('kadaluarsa').value);

  if (!namaBarang || !jumlah || !kadaluarsa) {
    alert("Pastikan semua input diisi!");
    return;
  }

  // Ambil data pengguna dari localStorage
  let userData = JSON.parse(localStorage.getItem('userData'));
  if (!userData) {
    alert('Data pengguna tidak ditemukan!');
    return;
  }

  let daysLeft = calculateDaysLeft(kadaluarsa);

  // Menambah barang ke data pengguna
  let newBarang = {
    nama: namaBarang,
    jumlah: jumlah,
    kadaluarsa: kadaluarsa.toISOString(),
    isKadaluarsa: daysLeft < 0,
    daysLeft: daysLeft
  };

  if (!userData[currentUser]) {
    userData[currentUser] = { barang: [] };
  }

  userData[currentUser].barang.push(newBarang);
  localStorage.setItem('userData', JSON.stringify(userData));

  loadBarang(currentUser); // Memperbarui tabel barang setelah menambah
});

// Fungsi untuk memuat barang dari localStorage dan menampilkannya di tabel
function loadBarang(username) {
  let userData = JSON.parse(localStorage.getItem('userData'));
  let barangTable = document.getElementById('barangTable').getElementsByTagName('tbody')[0];
  barangTable.innerHTML = '';

  if (userData && userData[username]) {
    userData[username].barang.forEach((item, index) => {
      let row = barangTable.insertRow();

      let cellNama = row.insertCell(0);
      let cellJumlah = row.insertCell(1);
      let cellKadaluarsa = row.insertCell(2);
      let cellStatus = row.insertCell(3);
      let cellHariLagi = row.insertCell(4);
      let cellAksi = row.insertCell(5);

      cellNama.textContent = item.nama;
      cellJumlah.textContent = item.jumlah;
      cellKadaluarsa.textContent = new Date(item.kadaluarsa).toLocaleDateString();
      cellStatus.textContent = item.isKadaluarsa ? 'Kadaluarsa' : 'Belum Kadaluarsa';
      cellHariLagi.textContent = item.isKadaluarsa ? '-' : item.daysLeft + ' hari lagi';

      let deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Hapus';
      deleteBtn.classList.add('delete');
      deleteBtn.onclick = function() {
        deleteBarang(username, index);
      };

      cellAksi.appendChild(deleteBtn);
    });
  }
}

// Fungsi untuk menghitung sisa hari hingga kadaluarsa
function calculateDaysLeft(kadaluarsaDate) {
  let today = new Date();
  let timeDiff = kadaluarsaDate - today;
  return Math.floor(timeDiff / (1000 * 3600 * 24));
}

// Fungsi untuk menghapus barang dari daftar
function deleteBarang(username, index) {
  let userData = JSON.parse(localStorage.getItem('userData'));
  if (userData && userData[username]) {
    userData[username].barang.splice(index, 1);
    localStorage.setItem('userData', JSON.stringify(userData));
    loadBarang(username); // Memperbarui tabel setelah barang dihapus
  }
}

// Logout button event listener
document.getElementById('logoutBtn').addEventListener('click', function() {
  localStorage.removeItem('currentUser');
  window.location.href = 'index.html';  // Redirect ke halaman login setelah logout
});
