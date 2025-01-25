const db = require('../infrastructure/database/connection');
const responsAPI = require('../infrastructure/reponse');

exports.getAllproduct = (req, res) => {
    const sql = 'SELECT * FROM product'
    db.query(sql, (err, result) => {
        if (err) {
            return responsAPI(500,'No data found','Kegagalan menyambungkan ke Datbase',res)
        }else {
            if (result.length==0){
                return responsAPI(404,'No data found','Data kosong',res)
            }else {
                return responsAPI(200,result,'Berhasil mendapatkan semua produk',res)
            }
        }
    })
}

exports.getProductByid = (req, res) => {
    const id = req.params.id
    const sql = 'SELECT * FROM product WHERE id_produk =?'
    db.query(sql, [id], (err, result) => {
        if (err) {
            return responsAPI(500,'No data found','Kegagalan menyambungkan ke Datbase',res)
        }else {
            if (result.length==0){
                return responsAPI(404,'No data found','Data produk dengan ID '+id+' tidak ditemukan',res)
            }else {
                return responsAPI(200,result,'Berhasil mendapatkan data produk '+id,res)
            }
        }
    })
}

// Controller for creating transaksi
exports.createTransaksi = (req, res) => {
    // Ambil metode pembayaran dan idkaryawan dari request body dan session
    const { metode } = req.body;
    const karyawan = req.session.user.name;  // Ambil idkaryawan dari session
  
    if (!karyawan) {
      return res.status(400).json({
        message: "User not logged in",
        success: false
      });
    }
  
    // SQL query untuk membuat transaksi
    const sql = 'INSERT INTO transaksi (tanggal, metodeBayar, namaKaryawan) VALUES (NOW(),?,?)';
    db.query(sql, [metode, karyawan], (err, result) => {
      if (err) {
        return res.status(500).json({
          message: 'Failed to create transaksi',
          error: err
        });
      } else {
        return res.status(201).json({
          message: 'Berhasil membuat transaksi',
          result: result
        });
      }
    });
  };
  
  exports.riwayatTransaksi = (req, res) => {
    const sql = "select * from riwayat"
    db.query(sql, (err, result) => {
        if (err) {
          return responsAPI(500, 'Failed to fetch :' + err, `Kegagalan membuat list item ${err}`, res);
        } else {
          return responsAPI(201, result, 'Berhasil mengambil riwayat', res);
        }
      });
  }
  // Controller for creating listitem
  exports.createListitem = (req, res) => {
    const { idtransaksi, idproduk, jumlah } = req.body;
    const sql = 'INSERT INTO listitem (idTransaksi, idProduk, jumlah) VALUES (?,?,?)';
    db.query(sql, [idtransaksi, idproduk, jumlah], (err, result) => {
      if (err) {
        return responsAPI(500, 'Failed to create list item', `Kegagalan membuat list item ${err}`, res);
      } else {
        return responsAPI(201, result, 'Berhasil membuat list item', res);
      }
    });
  };
  