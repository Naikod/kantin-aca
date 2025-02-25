const { siswa, user, menu, transaksi, detail_transaksi, menu_diskon, diskon } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const SECRET_KEY = "kantinnnnn";
// const moment = require('moment');

// register user as pelanggan
exports.registerSiswa = async (req, res) => {
    try {
        const { username, password, nama_siswa, alamat, telp } = req.body;
        const foto = req.file.filename;
        // pw
        const hashedPassword = await bcrypt.hash(password, 10);

        // create user
        const newUser = await user.create({
            username,
            password: hashedPassword,
            role: 'siswa',
        });

        // create siswa
        const newSiswa = await siswa.create({
            nama_siswa,
            alamat,
            telp,
            userID: newUser.userID,
            foto,
        });

        res.status(201).json({ message: 'Siswa registered successfully', data: newSiswa });
        // res.status(201).json({ message: 'Siswa registered successfully', data: newUser.userID });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// login 
exports.loginSiswa = async (req, res) => {
    try {
        const { username, password } = req.body;

        const foundUser = await user.findOne({ where: { username } });
        
        if (!foundUser || foundUser.role !== 'siswa') {
            return res.status(404).json({ message: 'User not found or not a siswa' });
        }

        const isPasswordValid = await bcrypt.compare(password, foundUser.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        const token = jwt.sign(
            { siswaID: foundUser.userID, role: foundUser.role },
            SECRET_KEY,
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

exports.updateSiswa = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, password, nama_siswa, alamat, telp, foto } = req.body;

        const currentSiswa = await siswa.findOne({ where: { siswaID: id } });
        if (!currentSiswa) {
            return res.status(404).json({ message: "Siswa not found" });
        }

        const currentUser = await user.findOne({ where: { userID: currentSiswa.userID } });
        if (!currentUser) {
            return res.status(404).json({ message: "User not found for the siswa" });
        }

        if (username || password) {
            const updatedUserData = {};
            if (username) updatedUserData.username = username;
            if (password) {
                updatedUserData.password = await bcrypt.hash(password, 10);
            }

            await currentUser.update(updatedUserData);
        }

        const updatedSiswaData = {
            nama_siswa: nama_siswa || currentSiswa.nama_siswa,
            alamat: alamat || currentSiswa.alamat,
            telp: telp || currentSiswa.telp,
            foto: foto || currentSiswa.foto,
        };

        await currentSiswa.update(updatedSiswaData);

        return res.status(200).json({
            message: "Siswa updated successfully",
            data: { updatedSiswa: currentSiswa, updatedUser: currentUser },
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

exports.getSiswa = async (request, response) => {
    try {
        let search = request.params.search;

        let data = await siswa.findAll({
            where: {
                [Op.or]: [
                    { nama_siswa: { [Op.substring]: search } },
                    { alamat: { [Op.substring]: search } },
                    { telp: { [Op.substring]: search } },
                ]
            },
        });

        return response.json({
            success: true,
            data: data,
            message: "Siswa profile retrieved successfully"
        });
    } catch (error) {
        return response.status(500).json({
            success: false,
            error: error.message
        });
    }
};





//liar menu
exports.getMenu = async (req, res) => {
    try {
        const menus = await menu.findAll();
        res.status(200).json({ data: menus });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// pessen makan munum
exports.createOrder = async (req, res) => {
    try {
        const { siswaID, menuID, qty } = req.body;

        // kl mw disc
        const menuItem = await menu.findByPk(menuID, {
            include: [
                {
                    model: menu_diskon,
                    include: [diskon],
                },
            ],
        });

        if (!menuItem) return res.status(404).json({ message: 'Menu not found' });

        const discount = menuItem.menu_diskons[0]?.diskon || null;
        let harga_beli = menuItem.harga;
        if (discount && moment().isBetween(discount.tanggal_awal, discount.tanggal_akhir)) {
            harga_beli -= (harga_beli * discount.persentase_diskon) / 100;
        }

        // tranasaksi
        const transaksiData = await transaksi.create({
            siswaID,
            stanID: menuItem.stanID,
            status: 'belum dikonfirm',
            tanggal: new Date(),
        });

        // deytail transaksi
        await detail_transaksi.create({
            transaksiID: transaksiData.id,
            menuID,
            qty,
            harga_beli,
        });

        res.status(201).json({ message: 'Order created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// liat status pesenan
exports.getOrderStatus = async (req, res) => {
    try {
        const { siswaID } = req.params;

        const orders = await transaksi.findAll({
            where: { siswaID },
            include: [
                {
                    model: detail_transaksi,
                    include: [menu],
                },
            ],
        });

        res.status(200).json({ data: orders });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// history based on month
exports.getTransactionHistory = async (req, res) => {
    try {
        const { siswaID, month } = req.params;

        const transactions = await transaksi.findAll({
            where: {
                siswaID,
                tanggal: {
                    [Op.between]: [
                        moment().month(month - 1).startOf('month').toDate(),
                        moment().month(month - 1).endOf('month').toDate(),
                    ],
                },
            },
            include: [
                {
                    model: detail_transaksi,
                    include: [menu],
                },
            ],
        });

        res.status(200).json({ data: transactions });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// print receipt
exports.printInvoice = async (req, res) => {
    try {
        const { transaksiID } = req.params;

        const transaction = await transaksi.findByPk(transaksiID, {
            include: [
                {
                    model: detail_transaksi,
                    include: [menu],
                },
                { model: siswa },
            ],
        });

        if (!transaction) return res.status(404).json({ message: 'Transaction not found' });

        // Generate invoice (simplified for this example)
        const invoice = {
            siswa: transaction.siswa.nama_siswa,
            tanggal: transaction.tanggal,
            items: transaction.detail_transaksis.map((item) => ({
                menu: item.menu.nama_makanan,
                qty: item.qty,
                harga: item.harga_beli,
            })),
            total: transaction.detail_transaksis.reduce((sum, item) => sum + item.harga_beli * item.qty, 0),
        };

        res.status(200).json({ invoice });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};