const { transaksi, user, stan, detail_transaksi } = require('../models');
const siswa = require('../models/siswa');


exports.siswaOrder = async (req, res) => {
    try {
        const { stanID, pesan } = req.body;
        const siswaID = req.user.siswaID;

        const transaksi = await transaksi.create({
            stanID,
            siswaID,
            status: 'pending',
        });

        for (const item of pesan) {
            await item.create({
                transaksiID: item.transaksiID,
                menuID: item.menuID,
                qty: item.qty,
            });
        }

        res.status(201).json({
            success: true,
            message: 'Order placed successfully',
            data: transaksi,
        });


    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Membuat transaksi baru
exports.createTransaksi = async (req, res) => {
  try {
    const { tanggal, stanID, siswaID, status } = req.body;
    const newTransaksi = await transaksi.create({
      tanggal,
      stanID,
      siswaID,
      status
    });
    res.status(201).json(newTransaksi);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mengambil transaksi berdasarkan ID
exports.getTransaksiById = async (req, res) => {
  try {
    const transaksiData = await transaksi.findByPk(req.params.id, {
      include: [user, stan, detail_transaksi]
    });
    if (!transaksiData) {
      return res.status(404).json({ message: 'Transaksi not found' });
    }
    res.status(200).json(transaksiData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mengupdate status transaksi
exports.updateStatusTransaksi = async (req, res) => {
  try {
    const transaksiData = await transaksi.findByPk(req.params.id);
    if (!transaksiData) {
      return res.status(404).json({ message: 'Transaksi not found' });
    }

    transaksiData.status = req.body.status;
    await transaksiData.save();
    res.status(200).json(transaksiData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Mengambil histori transaksi berdasarkan ID siswa
exports.getHistoryBySiswa = async (req, res) => {
  try {
    const { siswaID } = req.params;
    const transaksiData = await transaksi.findAll({
      where: { siswaID },
      include: [stan, detail_transaksi],  // Bisa ditambahkan model lain sesuai kebutuhan
    });
    if (!transaksiData || transaksiData.length === 0) {
      return res.status(404).json({ message: 'No transaksi found for this student' });
    }
    res.status(200).json(transaksiData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};