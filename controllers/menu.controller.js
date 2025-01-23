const { menu } = require('../models');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
// const { siswa, user, menu, transaksi, detail_transaksi, menu_diskon, diskon } = require('../models');


exports.addMenu = async (req, res) => {
    try {
        const { nama_makanan, harga, jenis, foto, deskripsi, stanID } = req.body;

        const newMenu = await menu.create({
            nama_makanan,
            harga,
            jenis,
            foto,
            deskripsi,
            stanID,
        });

        res.status(201).json({ message: 'New menu has been added!', data: newMenu });
        // res.status(201).json({ message: 'Siswa registered successfully', data: newUser.userID });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getMenu = async (request, response) => {
    try {
        let search = request.params.search;

        let data = await menu.findAll({
            where: {
                [Op.or]: [
                    { nama_makanan: { [Op.substring]: search } },
                    { harga: { [Op.substring]: search } },
                    { jenis: { [Op.substring]: search } },
                    { foto: { [Op.substring]: search } },
                    { deskripsi: { [Op.substring]: search } },
                ]
            },
        });

        return response.json({
            success: true,
            data: data,
            message: "Menu retrieved successfully"
        });
    } catch (error) {
        return response.status(500).json({
            success: false,
            error: error.message
        });
    }
};

exports.updateMenu = async (req, res) => {
    try {
        const { id } = req.params;
        const { nama_makanan, harga, jenis, foto, deskripsi, stanID } = req.body;


        const currentMenu = await siswa.findOne({ where: { menuID: id } });
        if (!currentMenu) {
            return res.status(404).json({ message: "Menu not found" });
        }

        const updatedMenuData = {
            nama_makanan:nama_makanan || currentMenu.nama_makanan,
            harga: harga || currentMenu.harga,
            jenis: jenis || currentMenu.jenis,
            foto: foto || currentMenu.foto,
            deskripsi: deskripsi || currentMenu.deskripsi,
        };

        await currentMenu.update(updatedMenuData);

        
        return res.status(200).json({
            message: "Menu updated successfully",
            data: { updatedMenu: currentMenu },
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

exports.deleteMenu = async (req, res) => {
    try {
      const menuData = await menu.findByPk(req.params.id);
      if (!menuData) {
        return res.status(404).json({ message: 'Menu not found' });
      }
      await menuData.destroy();
      res.status(200).json({ message: 'Menu deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

exports.getAllMenus = async (req, res) => {
  try {
    const allMenu = await menu.findAll();
    res.status(200).json(allMenu);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// // Mendapatkan menu berdasarkan ID
// exports.getMenuById = async (req, res) => {
//   try {
//     const menuData = await menu.findByPk(req.params.id);
//     if (!menuData) {
//       return res.status(404).json({ message: 'Menu not found' });
//     }
//     res.status(200).json(menuData);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

