const express = require('express');
const bodyParser = require('body-parser');
const admincontroller = require('../controller/admincontroller');
const db = require('../infrastructure/database/connection');
const auth = require('../middleware/auth')
const multer = require("multer");

const admin = express.Router();
admin.use(bodyParser.json());

admin.use(auth.validateAdmin);

const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/public/images');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
})

const fileFilter = (req, file, cb) => { 
    if(file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true);
    } else {
        cb(null, false);
    }
}

admin.use(multer({storage: fileStorageEngine, fileFilter: fileFilter}).single('image'));

// frontend
admin.get('/dashboard', (req, res) => {
    const user = req.session.user;
    res.render('admin/dashboardAdmin', {user})
})

admin.get('/riwayat', (req, res) => {
    const user = req.session.user;
    res.render('admin/riwayat', {user})
})

admin.get('/user', (req, res) => {
    const user = req.session.user;
    const karyawan = 'SELECT * FROM karyawan';
    db.query(karyawan, (err, result) => {

        if(err) {
            console.log(err);
        }
        res.render('admin/user', {result, user});
})
})

//Karyawan
admin.get('/karyawan',admincontroller.getAllkaryawan)
admin.get('/karyawan/:nama',admincontroller.getKaryawanBynama)
admin.post('/karyawan',admincontroller.createKaryawan)
admin.put('/karyawan/:id',admincontroller.updateKaryawan)
admin.delete('/karyawan/:id',admincontroller.deleteKaryawan)

//Product
admin.get('/product', admincontroller.getAllproduct)
admin.get('/product/:nama',admincontroller.getProductBynama)
admin.post('/product', admincontroller.createProduct)
admin.put('/product/:id',admincontroller.updateProduct)
admin.delete('/product/:id',admincontroller.deleteProduct)

//Transaksi
admin.delete('/transaksi/:id',admincontroller.deleteTransaksi)
admin.get('/transaksi',admincontroller.riwayatTransaksi)

module.exports = admin;