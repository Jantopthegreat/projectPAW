const express = require('express');
const bodyParser = require('body-parser');
const pelanggancontroller = require('../controller/pelanggancontroller');

const pelanggan = express.Router();
pelanggan.use(bodyParser.json());

pelanggan.get('/',pelanggancontroller.getAllproduct)
pelanggan.get('/search:nama',pelanggancontroller.getProductBynama)

module.exports = pelanggan