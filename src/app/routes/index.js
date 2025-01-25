const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const pelanggan = require('./pelanggan');
const admin = require('./admin');
const karyawan = require('./karyawan');
const authMiddleware = require('../middleware/auth');
const app = express.Router()

require('dotenv').config()

app.use(bodyParser.json());

app.use(
    session({
        secret: process.env.SESSION_SECRET, // Ganti dengan kunci rahasia
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false }, // Ubah ke true jika menggunakan HTTPS
    })
);

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the API!' });
});

app.use('/login',authMiddleware.isAuthicated);
app.use('/pelanggan',pelanggan);
app.use('/admin',admin);
app.use('/karyawan',karyawan);
app.use('/logout', authMiddleware.logout)

module.exports = app;