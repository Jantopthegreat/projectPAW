const db = require('../infrastructure/database/connection');
const responsAPI = require('../infrastructure/reponse');

exports.getAllproduct = (req,res) =>{
    const sql = 'SELECT * FROM product' 
    db.query(sql, (err, result) => {
        if(err){
            return responsAPI(500,'No data found','Kegagalan menyambungkan ke database' + err,res)
        }else{
            if(result.length==0){
                return responsAPI(404,'No data found','Data kosong',res)
            }else{
                return responsAPI(200,result,'Berhasil mendapatkan semua data product',res)
            }
        }
    })
}

exports.getProductBynama = (req,res) => {
    const nama = req.body.nama
    const sql = 'SELECT * FROM user WHERE namaProduk =?'
    db.query(sql, [nama], (err, result) => {
        if (err) {
            return responsAPI(500,'Failed to get user','Kegagalan mendapatkan data user',res)
        }else {
            if (result.length==0){
                return responsAPI(404,'No data found','Data user dengan ID '+ nama +' tidak ditemukan',res)
            }else {
                return responsAPI(200,result,'Berhasil mendapatkan data user',res)
            }
        }
    })
}

exports.createProduct = (req,res) =>{
    const { namaProduk,kategori,harga } = req.body
    if (!req.file) {
        const err = new Error('Please upload a file')
        throw err;
    }
    const image = req.file.filename
    console.log(image)
    const img = 'INSERT INTO foto(link) values(?)'

    db.query(img, [image], (err, result) => {
        if(err){
            return responsAPI(500,'Failed to create product','Kegagalan membuat product',res)
        }else{
            db.query('SELECT idFoto FROM foto WHERE link = ?', [image], (err, result) => {  
                if(err){
                    return responsAPI(500,'Failed to create product','Kegagalan membuat product',res)
                }else{
                    const idFoto = result[0].idFoto
                    const sql = 'INSERT INTO produk(namaProduk, kategori, harga, linkFoto) VALUES (?,?,?,?)'
                    db.query(sql, [namaProduk, kategori, harga, idFoto], (err, result) => {
                        if(err){
                            return responsAPI(500,'Failed to create product','Kegagalan membuat product',res)
                        }else{
                            return responsAPI(201,result,'Berhasil membuat product',res)
                        }
                    })
                }
            })    
        }
    })

}

exports.updateProduct = (req,res) => {
    const id = req.params.id
    const { namaProduk, kategori, harga } = req.body
    const sql = 'UPDATE produk SET namaProduk =?, kategori =?, harga =? WHERE idProduk =?'
    db.query(sql, [namaProduk, kategori, harga, id], (err, result) => {
        if(err){
            return responsAPI(500,'Failed to update product','Kegagalan mengubah product',res)
        }else{
            if(result.affectedRows==0){
                return responsAPI(404,'No data found','Data product dengan ID '+ id +' tidak ditemukan',res)
            }else{
                return responsAPI(200,result,'Berhasil mengubah product',res)
            }
        }
    })
}

exports.deleteProduct = (req,res) => {
    const id = req.params.id
    const sql = 'DELETE FROM foto WHERE idFoto = (select linkFoto from produk where idProduk = ?); DELETE FROM produk WHERE idProduk =?'
    db.query(sql, [id], (err, result) => {
        if(err){
            return responsAPI(500,'Failed to delete product','Kegagalan menghapus product',res)
        }else{
            if(result.affectedRows==0){
                return responsAPI(404,'No data found','Data product dengan ID '+ id +' tidak ditemukan',res)
            }else{
                return responsAPI(200,result,'Berhasil menghapus product',res)
            }
        }
    })
}

exports.getAllkaryawan = (req,res) => {
    const sql = 'SELECT * FROM karyawan'
    db.query(sql, (err, result) => {
        if(err){
            return responsAPI(500,'No data found','Kegagalan menyambungkan ke database' + err,res)
        }else{
            if(result.length==0){
                return responsAPI(404,'No data found','Data kosong',res)
            }else{
                return responsAPI(200,result,'Berhasil mendapatkan semua data karyawan',res)
            }
        }
    })
}

exports.getKaryawanBynama = (req,res) => {
    const nama = req.body.id
    const sql = 'SELECT * FROM karyawan WHERE idKaryawan =?'
    db.query(sql, [nama], (err, result) => {
        if (err) {
            return responsAPI(500,'Failed to get karyawan','Kegagalan mendapatkan data karyawan',res)
        }else {
            if (result.length==0){
                return responsAPI(404,'No data found','Data karyawan dengan ID '+ nama +' tidak ditemukan',res)
            }else {
                return responsAPI(200,result,'Berhasil mendapatkan data karyawan',res)
            }
        }
    })
}

exports.createKaryawan = (req,res) =>{
    const { namaKaryawan, username, password } = req.body
    const sql = 'INSERT INTO karyawan (username, password, namaKaryawan) VALUES (?,?,?)'
    db.query(sql, [username, password,namaKaryawan ], (err, result) => {
        if(err){
            return responsAPI(500,'Failed to create karyawan','Kegagalan membuat karyawan',res)
        }else{
         res.redirect('/admin/user')
        }
    })
}

exports.updateKaryawan = (req,res) => {
    const id = req.params.id
    const { namaKaryawan, username, password } = req.body
    const sql = 'UPDATE karyawan SET username =?, password =?, namaKaryawan =? WHERE idKaryawan =?'
    db.query(sql, [username, password, namaKaryawan, id], (err, result) => {
        if(err){
            return responsAPI(500,'Failed to update karyawan','Kegagalan mengubah karyawan',res)
        }else{
            if(result.affectedRows==0){
                return responsAPI(404,'No data found','Data karyawan dengan ID '+ id +' tidak ditemukan',res)
            }else{
                return responsAPI(200,result,'Berhasil mengubah karyawan',res)
            }
        }
    })
}

exports.deleteKaryawan = (req,res) => {
    const id = req.params.id
    const sql = 'DELETE FROM karyawan WHERE idKaryawan = ?'
    db.query(sql, [id], (err, result) => {
        if(err){
            return responsAPI(500,'Failed to delete karyawan','Kegagalan menghapus karyawan',res)
        }else{
            if(result.affectedRows==0){
                return responsAPI(404,'No data found','Data karyawan dengan ID '+ id +' tidak ditemukan',res)
            }else{
                return responsAPI(200,result,'Berhasil menghapus karyawan',res)
            }
        }
    })
}

exports.riwayatTransaksi = (req, res) => {
    const sql = "select * from riwayat"
    db.query(sql, (err, result) => {
        if (err) {
          return responsAPI(500, 'Failed to fetch :' + err, `Kegagalan membuat list item ${err}`, res);
        } else {
          return responsAPI(201, result, 'Berhasil membuat list item', res);
        }
      });
  }

exports.deleteTransaksi = (req,res) => {
    const id = req.params.id
    const sql = 'DELETE FROM transaksi WHERE idTRX =?'
    db.query(sql, [id], (err, result) => {
        if(err){
            return responsAPI(500,'Failed to delete transaksi','Kegagalan menghapus transaksi',res)
        }else{
            if(result.affectedRows==0){
                return responsAPI(404,'No data found','Data transaksi dengan ID '+ id +' tidak ditemukan',res)
            }else{
                return responsAPI(200,result,'Berhasil menghapus transaksi',res)
            }
        }
    })
}