const express = require('express');
const app = express();
const transaksiController = require('../controllers/transaksi.controller');
const auth = require('../auth/auth')

//app.post('/', auth.authVerify, transaksiController.siswaOrder);
app.post('/', auth.authVerify, transaksiController.createTransaksi);

// // Membuat transaksi baru
// router.post('/', transaksiController.createTransaksi);


// // Melihat status transaksi
// router.get('/:id', transaksiController.getTransaksiById);

// // Melihat histori transaksi siswa
// router.get('/history/:id_siswa', transaksiController.getHistoryBySiswa);

// // Mengupdate status transaksi (route baru)
// router.put('/:id/status', transaksiController.updateStatusTransaksi);  // Gunakan PUT untuk update

module.exports = app;