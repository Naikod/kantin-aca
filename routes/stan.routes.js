const express = require('express');
const app = express();
const stanController = require('../controllers/stan.controller');
// console.log(stanController); // Tambahkan log ini untuk memeriksa apakah stanController terimpor dengan benar



app.post('/register', stanController.registerStan); 
app.get('/:search', stanController.getStan); 
app.post('/login', stanController.loginStan); 
app.put('/:id', stanController.updateStan); 
app.get('/', stanController.getAllStan); 
app.get('/siswa/:search', stanController.searchSiswa); 
app.delete('/siswa/:id', stanController.deleteSiswaById); 
app.put('/siswa/:id', stanController.updateSiswaById); 
app.post('/siswa/:id', stanController.addSiswa); 
// // Menambahkan stan
// router.post('/', stanController.createStan);

// // Mengelola stan berdasarkan ID
// router.put('/:id', stanController.updateStan);

// Melihat semua stan
// app.get('/', stanController.getAllStan);

// // Mendapatkan stan berdasarkan ID
// router.get('/:id', stanController.getStanById);

// // Menghapus stan
// router.delete('/:id', stanController.deleteStan);

module.exports = app;