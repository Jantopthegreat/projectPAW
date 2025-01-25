const express = require('express')
const bodyParser = require('body-parser')
const karyawancontroller = require('../controller/karyawancontroller')
const auth = require('../middleware/auth');

const karyawan = express.Router()
karyawan.use(bodyParser.json())

karyawan.use(auth.validateKaryawan);

// frontend
karyawan.get('/dashboard', (req, res) => {
    const user = req.session.user;
    res.render('karyawan/dashboardKaryawan', {user})
})
karyawan.get('/riwayat', (req, res) => {
    const user = req.session.user;
    res.render('karyawan/riwayat', {user})
})

//produk
karyawan.get('/product',karyawancontroller.getAllproduct);
karyawan.get('/product:id',karyawancontroller.getProductByid)

//transaksi
karyawan.get('/transaksi',karyawancontroller.riwayatTransaksi)
karyawan.post('/transaksi',karyawancontroller.createTransaksi)
//List item
karyawan.post('/listitem',karyawancontroller.createListitem)

module.exports = karyawan;