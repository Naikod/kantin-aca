const { menu_diskon } = require('../models');

// Menambahkan menu yang mendapatkan diskon
exports.createMenuDiskon = async (req, res) => {
  try {
    const { menuID, diskonID } = req.body;
    const newMenuDiskon = await menu_diskon.create({
      menuID,
      diskonID
    });
    res.status(201).json(newMenuDiskon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mengambil semua menu diskon
exports.getAllMenuDiskon = async (req, res) => {
  try {
    const allMenuDiskon = await menu_diskon.findAll();
    res.status(200).json(allMenuDiskon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};