# 📝 NoteList - Fullstack JavaScript Note App

![JavaScript](https://img.shields.io/badge/javascript-99.4%25-yellow)
![React](https://img.shields.io/badge/react-18.x-blue)
![NodeJS](https://img.shields.io/badge/node.js-20.x-green)
![Prisma](https://img.shields.io/badge/prisma-5.x-white)

**NoteList** adalah aplikasi manajemen catatan modern yang dibangun sepenuhnya menggunakan ekosistem **JavaScript** (Fullstack). Aplikasi ini dirancang untuk membantu pengguna menyimpan ide, rencana, dan daftar tugas dengan antarmuka yang bersih, responsif, dan mudah digunakan.

Proyek ini menerapkan arsitektur **Monorepo** (Frontend & Backend terpisah) dan praktik terbaik pengembangan web modern seperti autentikasi yang aman, validasi data, dan manajemen state yang efisien.

---

## 🚀 Fitur Unggulan

### 🔐 Autentikasi & Keamanan
* **User Registration & Login:** Sistem pendaftaran dan login yang aman.
* **Token-Based Auth:** Menggunakan token unik (UUID) untuk menjaga sesi pengguna tetap aman.
* **Password Encryption:** Password dienkripsi menggunakan `bcrypt` sebelum disimpan ke database.
* **Auth Guard:** Proteksi halaman (Route Guard) di Frontend untuk mencegah akses tanpa login.

### 📝 Manajemen Catatan (CRUD)
* **Buat Catatan:** Editor teks yang nyaman untuk menulis judul dan isi catatan.
* **Edit & Hapus:** Memperbarui isi catatan atau menghapusnya jika sudah tidak diperlukan.
* **Pencarian:** Fitur pencarian catatan berdasarkan judul atau isi.
* **Pagination:** Menampilkan daftar catatan dengan sistem halaman (paging) agar performa tetap ringan.

### 🗂️ Manajemen Kategori
* **Kategori Dinamis:** Pengguna bisa membuat, mengedit, dan menghapus kategori sesuai kebutuhan.
* **Assign Category:** Mengelompokkan catatan ke dalam kategori tertentu agar lebih terorganisir.
* **Dropdown Interaktif:** UI pemilihan kategori yang intuitif dengan fitur *search* di dalamnya.

### 🎨 User Interface (UI/UX)
* **Responsive Design:** Tampilan menyesuaikan layar desktop dan mobile (dibangun dengan Tailwind CSS).
* **Loading States:** Indikator loading yang halus saat mengambil data atau memproses *request*.
* **Interactive Alerts:** Notifikasi sukses/gagal yang cantik menggunakan `SweetAlert2`.
* **Error Handling:** Penanganan error yang rapi, mencegah aplikasi *crash* saat terjadi kesalahan data.

---
