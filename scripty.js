// Fungsi untuk login
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
  
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
  
    // Mengecek jika username dan password sudah ada
    let userData = JSON.parse(localStorage.getItem('userData')) || {};
    
    // Simpan data login di localStorage
    if (!userData[username]) {
      userData[username] = { password: password, barang: [] };
    } else if (userData[username].password !== password) {
      alert('Password salah');
      return;
    }
  
    localStorage.setItem('userData', JSON.stringify(userData));
    localStorage.setItem('currentUser', username);
    showMainPage(username);
  });
  
  // Menampilkan halaman utama setelah login
  function showMainPage(username) {
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('mainPage').style.display = 'block';
  
    loadBarang(username);
  }
  
  // Menambahkan barang
  document.getElementById('barangForm').addEventListener('submit', function(e) {
    e.preventDefault();
  
    let namaBarang = document.getElementById('barangNama').value;
    let jumlah = document.getElementById('jumlah').value;
    let kadaluarsa = new Date(document.getElementById('kadaluarsa').value);
  
    let currentUser = localStorage.getItem('currentUser');
    let userData = JSON.parse(localStorage.getItem('userData'));
  
    let daysLeft = calculateDaysLeft(kadaluarsa);
  
    // Menambahkan barang ke data
    let newBarang = {
      nama: namaBarang,
      jumlah: jumlah,
      kadaluarsa: kadaluarsa.toISOString(),
      isKadaluarsa: daysLeft < 0,
      daysLeft: daysLeft
    };
  
    userData[currentUser].barang.push(newBarang);
    localStorage.setItem('userData', JSON.stringify(userData));
  
    loadBarang(currentUser);
  });
  
  // Menampilkan daftar barang dalam bentuk tabel
  function loadBarang(username) {
    let userData = JSON.parse(localStorage.getItem('userData'));
    let barangTable = document.getElementById('barangTable').getElementsByTagName('tbody')[0];
    barangTable.innerHTML = '';  // Clear table before reloading
  
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
  
      // Tombol Hapus
      let deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Hapus';
      deleteBtn.classList.add('delete');
      deleteBtn.onclick = function() {
        deleteBarang(username, index);
      };
  
      cellAksi.appendChild(deleteBtn);
    });
  }
  
  // Menghitung jumlah hari hingga kadaluarsa
  function calculateDaysLeft(kadaluarsaDate) {
    let today = new Date();
    let timeDiff = kadaluarsaDate - today;
    return Math.floor(timeDiff / (1000 * 3600 * 24));
  }
  
  // Fungsi untuk menghapus barang
  function deleteBarang(username, index) {
    let userData = JSON.parse(localStorage.getItem('userData'));
  
    // Menghapus barang berdasarkan index
    userData[username].barang.splice(index, 1);
  
    // Menyimpan data kembali ke localStorage
    localStorage.setItem('userData', JSON.stringify(userData));
  
    // Memuat ulang tabel barang
    loadBarang(username);
  }
  
  // Logout
  document.getElementById('logoutBtn').addEventListener('click', function() {
    localStorage.removeItem('currentUser');
    document.getElementById('loginPage').style.display = 'block';
    document.getElementById('mainPage').style.display = 'none';
  });
  