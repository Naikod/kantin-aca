const { users, stan, siswa, menu, transaksi, detail_transaksi } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

// register stan n admin
exports.registerAdminStan = async (req, res) => {
    try {
        const { username, password, nama_stan, nama_pemilik, telp } = req.body;

        // pw
        const hashedPassword = await bcrypt.hash(password, 10);

        // new user
        const user = await users.create({
            username,
            password: hashedPassword,
            role: 'admin_stan',
        });

        // stan
        await stan.create({
            nama_stan,
            nama_pemilik,
            telp,
            userID: user.id,
        });

        res.status(201).json({ message: 'Admin Stan registered successfully', data: user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// admin login
exports.loginAdminStan = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await users.findOne({ where: { username, role: 'admin_stan' } });
        if (!user) return res.status(404).json({ message: 'Admin Stan not found' });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ message: 'Invalid password' });

        const token = jwt.sign({ userID: user.id, role: user.role }, 'secret', { expiresIn: '1d' });

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// update stann
exports.updateStanProfile = async (req, res) => {
    try {
        const { stanID } = req.params;
        const { nama_stan, nama_pemilik, telp } = req.body;

        const stanData = await stan.findByPk(stanID);
        if (!stanData) return res.status(404).json({ message: 'Stan not found' });

        await stanData.update({
            nama_stan: nama_stan || stanData.nama_stan,
            nama_pemilik: nama_pemilik || stanData.nama_pemilik,
            telp: telp || stanData.telp,
        });

        res.status(200).json({ message: 'Stan profile updated successfully', data: stanData });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// crud pelanggan
exports.createPelanggan = async (req, res) => {
    try {
        const { nama_siswa, alamat, telp, username, password, foto } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await users.create({
            username,
            password: hashedPassword,
            role: 'siswa',
        });

        const pelanggan = await siswa.create({
            nama_siswa,
            alamat,
            telp,
            foto,
            userID: user.id,
        });

        res.status(201).json({ message: 'Pelanggan created successfully', data: pelanggan });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updatePelanggan = async (req, res) => {
    try {
        const { siswaID } = req.params;
        const { nama_siswa, alamat, telp, foto } = req.body;

        const pelanggan = await siswa.findByPk(siswaID);
        if (!pelanggan) return res.status(404).json({ message: 'Pelanggan not found' });

        await pelanggan.update({
            nama_siswa: nama_siswa || pelanggan.nama_siswa,
            alamat: alamat || pelanggan.alamat,
            telp: telp || pelanggan.telp,
            foto: foto || pelanggan.foto,
        });

        res.status(200).json({ message: 'Pelanggan updated successfully', data: pelanggan });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deletePelanggan = async (req, res) => {
    try {
        const { siswaID } = req.params;

        const pelanggan = await siswa.findByPk(siswaID);
        if (!pelanggan) return res.status(404).json({ message: 'Pelanggan not found' });

        await pelanggan.destroy();

        res.status(200).json({ message: 'Pelanggan deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// crud menu
exports.createMenu = async (req, res) => {
    try {
        const { nama_makanan, harga, jenis, deskripsi, stanID } = req.body;

        const menuData = await menu.create({
            nama_makanan,
            harga,
            jenis,
            deskripsi,
            stanID,
        });

        res.status(201).json({ message: 'Menu created successfully', data: menuData });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// konfirm the status
exports.updateStatusPesanan = async (req, res) => {
    try {
        const { transaksiID } = req.params;
        const { status } = req.body;

        const transaksiData = await transaksi.findByPk(transaksiID);
        if (!transaksiData) return res.status(404).json({ message: 'Transaksi not found' });

        await transaksiData.update({ status });

        res.status(200).json({ message: 'Status pesanan updated successfully', data: transaksiData });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// liat data pesanan by month
exports.getPesananByBulan = async (req, res) => {
    try {
        const { bulan } = req.params;

        const pesanan = await transaksi.findAll({
            where: {
                createdAt: {
                    [Op.between]: [
                        new Date(`${bulan}-01`),
                        new Date(`${bulan}-31`),
                    ],
                },
            },
        });

        res.status(200).json({ data: pesanan });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// income per month
exports.getPemasukanByBulan = async (req, res) => {
    try {
        const { bulan } = req.params;

        const pemasukan = await detail_transaksi.findAll({
            where: {
                createdAt: {
                    [Op.between]: [
                        new Date(`${bulan}-01`),
                        new Date(`${bulan}-31`),
                    ],
                },
            },
            attributes: [
                [sequelize.fn('SUM', sequelize.col('harga_beli')), 'total_pemasukan'],
            ],
        });

        res.status(200).json({ data: pemasukan });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};







// const user = require('../models/index').user
// const Detail = require('../models/index').detail_transaksi
// const Menu = require('../models/index').menu
// const path = require(`path`)
// const Op = require(`sequelize`).Op
// const fs = require(`fs`)
// const upload = require('./upload-image').single("filename")

// exports.searchUser = async (request, response) => {
//     let search = request.params.search
//     let data = await user.findAll({
//         where: {
//             [Op.or]: [
//                 { username: { [Op.substring]: search } },
//                 { password: { [Op.substring]: search } },
//                 { role: { [Op.substring]: search } },
//             ]
//         }
//     })
//     return response.json({
//         success: true,
//         data: data,
//         message: `user has retrived`
//     })
// }

// exports.addUser = async (request, response) => {
//     upload(request, response, async error => {
//         if (error) {
//             return response.json({ message: error })
//         }
//         if (!request.file) {
//             return response.json({ message: "No file" })
//         }

//         let newUser = {
//             username: request.body.username,
//             password: request.body.password,
//             role: request.body.role,
//         };

//         // required field is missing
//         if (!newUser.username || !newUser.password || !newUser.role) {
//             return response.status(400).json({ message: "data harus diisi!" });
//         }

//         console.log(newUser);

//         user.create(newUser)
//             .then(result => {
//                 return response.json({
//                     status: true,
//                     data: result,
//                     message: "User has been added"
//                 });
//             })
//             .catch(error => {
//                 return response.json({
//                     status: false,
//                     message: error.message
//                 });
//             });
//     });
// };


// exports.updateUser = async (request, response) => {
//     upload(request, response, async error => {
//         if (error) {
//             return response.json({ message: error })
//         }
//         let id = request.params.id
//         let updatedUser = {
//             username: request.body.username,
//             password: request.body.password,
//             role: request.body.role,
//             // image: request.file.filename
//         }
//         if (!updatedUser.username || !updatedUser.password || !updatedUser.role) {
//             return response.status(400).json({ success: false, message: 'Semua kolom harus diisi' });
//         }
//         if (request.file) {
//             const cariUser = await user.findOne({
//                 where: { userID: id }
//             })
//             const fotolama = cariUser.image
//             const pathfoto = path.join(__dirname, `../image`, fotolama)
//             if (fs.existsSync(pathfoto)) {
//                 fs.unlinkSync(pathfoto, error => console.log(error))
//             }
//             cariUser.image = request.file.filename
//         }

//         user.update(updatedUser, { where: { userID: id } })
//             .then(result => {
//                 if (result[0] === 1) {
//                     return user.findByPk(id)
//                         .then(updatedUser => {
//                             return response.json({
//                                 success: true,
//                                 data: this.updateUser,
//                                 message: 'User has updated'
//                             })
//                         })
//                         .catch(error => {
//                             return response.json({
//                                 success: false,
//                                 message: error.message
//                             })
//                         })
//                 } else {
//                     return response.json({
//                         success: false,
//                         message: 'user not found'
//                     })
//                 }
//             })
//             .catch(error => {
//                 return response.json({
//                     success: false,
//                     message: error.message
//                 })
//             })
//     })

// }

// exports.deleteUser = async (request, response) => {
//     const id = request.params.id;

//     try {
//         const userToDelete = await user.findOne({ where: { userID: id } });

//         // Jika kopi tidak ditemukan
//         if (!userToDelete) {
//             return response.json({
//                 status: false,
//                 message: "user Not Found"
//             });
//         }

//         await Detail.destroy({ where: { siswaID: id } });
//         await Menu.destroy({ where: { menuID: id } });


//         // Hapus kopi
//         await userToDelete.destroy();

//         return response.json({
//             status: true,
//             message: "user has been deleted"
//         });
//     } catch (error) {
//         console.log(error);
//         console.error('Error while deleting data:', error);
//         return response.status(500).json({
//             status: false,
//             message: 'Failed to delete data',
//             error: error.message
//         });
//     }
// };
