const db = require('../infrastructure/database/connection');
const responsAPI = require('../infrastructure/reponse');

exports.getAllproduct = (req,res) => {
    const sql = 'select * from product'
    db.query(sql, (err, result) => {
        if (err) {
            return responsAPI(500,'No data found','Kegagalan menyambungkan ke Datbase',res)
        }else {
            if (result.length==0){
                return responsAPI(404,'No data found','Data kosong',res)
            }else {
                return responsAPI(200,result,'Berhasil mendapatkan data user',res)
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