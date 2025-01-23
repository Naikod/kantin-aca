const express = require('express');
const app = express();
const menuController = require('../controllers/menu.controller');

// Menambahkan menu
app.post('/addmenu', menuController.addMenu);


// Melihat semua meneu
app.get('/:search', menuController.getMenu);
app.post('/', menuController.addMenu);
app.get('/', menuController.getAllMenus);
app.put('/:id', menuController.updateMenu);
app.delete('/:id', menuController.deleteMenu);

// // Mendapatkan menu 
// app.get('/:id', menuController.getMenuById);

// // Mengupdate menu
// app.put('/:id', menuController.updateMenu);

// // Menghapus menu
// app.delete('/:id', menuController.deleteMenu);


module.exports = app;