const { detail_transaksi, menu } = require('../models');

exports.createDetailTransaksi = async (req, res) => {
  try {
    const { transaksiID, menuID, qty, harga_beli } = req.body;
    const newDetail = await detail_transaksi.create({  //pake s atau engga
      transaksiID,
      menuID,
      qty,
      harga_beli
    });
    res.status(201).json(newDetail);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllDetailTransaksi = async (req, res) => {
  try {
    const allDetails = await detail_transaksi.findAll({
      include: [menu]
    });
    res.status(200).json(allDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};