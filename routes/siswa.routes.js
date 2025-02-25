const express = require('express');
const app = express();
const siswaController = require('../controllers/siswa.controller');
const auth = require('../auth/auth');
const upload = require('../utils/uploads');

app.post('/register',  upload.single("foto"), siswaController.registerSiswa); 
app.post('/login', siswaController.loginSiswa); 
app.put("/:id", siswaController.updateSiswa);      
app.get("/:search", siswaController.getSiswa);
// app.post("/order", auth.authVerify, siswaController.siswaOrder);

// app.get('/menu', siswaController.getMenu);           
// app.post('/order', auth.authVerify, siswaController.placeOrder); 
// app.get('/order-status', auth.authVerify, siswaController.getOrderStatus); 
// app.get('/order-history', auth.authVerify, siswaController.getOrderHistory); 
// app.get('/print-invoice/:id', auth.authVerify, siswaController.printInvoice); 

module.exports = app;