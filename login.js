document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
  
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
  
    let userData = JSON.parse(localStorage.getItem('userData')) || {};
    
    if (!userData[username]) {
      userData[username] = { password: password, barang: [] };
    } else if (userData[username].password !== password) {
      alert('Password salah');
      return;
    }
  
    localStorage.setItem('userData', JSON.stringify(userData));
    localStorage.setItem('currentUser', username);
    window.location.href = 'main.html';  // Redirect ke halaman utama setelah login berhasil
  });
  