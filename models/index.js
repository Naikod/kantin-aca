'use strict';

const fs = require('fs');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize'); // Memastikan Anda hanya mengimpor Sequelize sekali
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

// Membuat koneksi Sequelize
let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Memuat semua model secara dinamis dari direktori models
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&   // Tidak memuat file yang diawali dengan titik
      file !== basename &&         // Tidak memuat file index.js
      file.slice(-3) === '.js' &&  // Memuat hanya file yang berextensi .js
      file.indexOf('.test.js') === -1 // Menghindari file test.js
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, DataTypes); // Menggunakan DataTypes yang diimpor langsung
    db[model.name] = model;  // Menambahkan model ke objek db
  });

// Membuat relasi antar model
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Menambahkan koneksi sequelize dan Sequelize itu sendiri ke dalam objek db
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
