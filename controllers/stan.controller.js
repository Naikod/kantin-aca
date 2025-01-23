const { siswa, user, menu, stan, transaksi, detail_transaksi, menu_diskon, diskon } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');


exports.registerStan = async (req, res) => {
    try {
        const { nama_stan, nama_pemilik, telp, username, password } = req.body;
        // pw
        const hashedPassword = await bcrypt.hash(password, 10);


        // create user
        const newUser = await user.create({
            username,
            password: hashedPassword,
            role: 'admin_stan',
        });

        // create admin
        const newStan = await stan.create({
            nama_stan,
            nama_pemilik,
            telp,
            userID: newUser.userID,
        });

        res.status(202).json({ message: 'stan registered successfully', data: newStan });
        // res.status(201).json({ message: 'Siswa registered successfully', data: newUser.userID });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getStan = async (request, response) => {
    try {
        let search = request.params.search;

        let data = await stan.findAll({
            where: {
                [Op.or]: [
                    { nama_stan: { [Op.substring]: search } },
                    { nama_pemilik: { [Op.substring]: search } },
                    { telp: { [Op.substring]: search } },
                ]
            },
        });

        return response.json({
            success: true,
            data: data,
            message: "Stan retrieved successfully"
        });
    } catch (error) {
        return response.status(500).json({
            success: false,
            error: error.message
        });
    }
};

exports.getAllStan = async (req, res) => {
    try {
      const allStan = await stan.findAll();
      res.status(200).json(allStan);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

exports.loginStan = async (req, res) => {
    try {
        const { username, password } = req.body;

        const foundUser = await user.findOne({ where: { username } });
        if (!foundUser || foundUser.role !== 'admin_stan') {
            return res.status(404).json({ message: 'User not found or not an admin' });
        }


        const isPasswordValid = await bcrypt.compare(password, foundUser.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        
        const token = jwt.sign(
            { stanID: foundUser.userID, role: foundUser.role },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '1d' }
        );

        
        res.status(200).json({
            message: 'Login successful',
            token,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};



exports.updateStan = async (req, res) => {
    try {
      const stanData = await stan.findByPk(req.params.id);
      if (!stanData) {
        return res.status(404).json({ message: 'Stan dengan ID tersebut tidak ditemukan.' });
      }
  

      const allowedUpdates = ['nama_stan', 'nama_pemilik', 'telp', 'username', 'password'];
      const updates = Object.keys(req.body);
      const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
  
      if (!isValidOperation) {
        return res.status(400).json({ message: 'Field yang diupdate tidak valid.' });
      }
  
      await stanData.update(req.body);
  

      res.status(200).json({
        message: 'Data berhasil diperbarui.',
        data: stanData,
      });
    } catch (error) {
      res.status(500).json({ message: 'Terjadi kesalahan pada server.', error: error.message });
    }
  };

  
//FOLDER CRUD SISWA
exports.searchSiswa = async (req, res) => {
    try {
        const search = req.params.search;

        const users = await user.findAll({
            where: {
                username: { [Op.substring]: search },
            },
            attributes: ['userID', 'username'], 
        });

        const userIds = users.map(user => user.userID);

        const siswaData = await siswa.findAll({
            where: {
                [Op.or]: [
                    { nama_siswa: { [Op.substring]: search } },
                    { alamat: { [Op.substring]: search } },
                    { telp: { [Op.substring]: search } },
                    { userID: { [Op.in]: userIds } }, 
                ],
            },
        });

        if (siswaData.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No matching siswa found',
            });
        }


        const result = siswaData.map(siswaItem => {
            const matchedUser = users.find(user => user.userID === siswaItem.userID);
            return {
                ...siswaItem.dataValues,
                username: matchedUser ? matchedUser.username : null, 
            };
        });

        res.status(200).json({
            success: true,
            data: result,
            message: 'Siswa profiles retrieved successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};


exports.deleteSiswaById = async (req, res) => {
    try {
        const siswaID = req.params.id;

        const targetSiswa = await siswa.findByPk(siswaID);

        if (!targetSiswa) {
            return res.status(404).json({
                success: false,
                message: 'Siswa not found',
            });
        }

        const userID = targetSiswa.userID; 
        await siswa.destroy({
            where: { siswaID },
        });

        if (userID) {
            await user.destroy({
                where: { userID },
            });
        }

        res.status(200).json({
            success: true,
            message: 'Siswa and related user successfully deleted',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};

exports.updateSiswaById = async (req, res) => {
    try {
        const siswaID = req.params.id; 
        const { nama_siswa, alamat, telp, foto } = req.body;

        
        const targetSiswa = await siswa.findByPk(siswaID);

        if (!targetSiswa) {
            return res.status(404).json({
                success: false,
                message: 'Siswa not found',
            });
        }

        
        const updatedSiswa = await targetSiswa.update({
            nama_siswa: nama_siswa || targetSiswa.nama_siswa,
            alamat: alamat || targetSiswa.alamat,
            telp: telp || targetSiswa.telp,
            foto: foto || targetSiswa.foto, 
        });

        res.status(200).json({
            success: true,
            message: 'Siswa updated successfully',
            data: updatedSiswa,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};

exports.addSiswa = async (req, res) => {
    try {
        const { username, password, nama_siswa, alamat, telp, foto } = req.body;

        if (!username || !password || !nama_siswa || !alamat || !telp) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required',
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Buat user baru
        const newUser = await user.create({
            username,
            password: hashedPassword,
            role: 'siswa', // Set role sebagai siswa
        });

        // Buat siswa baru dengan userID yang terhubung
        const newSiswa = await siswa.create({
            nama_siswa,
            alamat,
            telp,
            userID: newUser.userID,
            foto, // Opsional: foto dapat berupa URL atau nama file
        });

        res.status(201).json({
            success: true,
            message: 'Siswa added successfully',
            data: newSiswa,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};

//  stan baru
exports.createStan = async (req, res) => {
  try {
    const { nama_stan, nama_pemilik, telp, userID } = req.body;
    const newStan = await stan.create({
      nama_stan,
      nama_pemilik,
      telp,
      userID
    });
    res.status(201).json(newStan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Mendapatkan stan berdasarkan ID
exports.getStanById = async (req, res) => {
  try {
    const stanData = await Stan.findByPk(req.params.id);
    if (!stanData) {
      return res.status(404).json({ message: 'Stan not found' });
    }
    res.status(200).json(stanData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mengupdate stan
// exports.updateStan = async (req, res) => {
//   try {
//     const stanData = await Stan.findByPk(req.params.id);
//     if (!stanData) {
//       return res.status(404).json({ message: 'Stan not found' });
//     }
//     await stanData.update(req.body);
//     res.status(200).json(stanData);

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// Menghapus stan
exports.deleteStan = async (req, res) => {
  try {
    const stanData = await Stan.findByPk(req.params.id);
    if (!stanData) {
      return res.status(404).json({ message: 'Stan not found' });
    }
    await stanData.destroy();
    res.status(200).json({ message: 'Stan deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};