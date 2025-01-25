const db = require('../infrastructure/database/connection');
const responsAPI = require('../infrastructure/reponse');


exports.isAuthicated = (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.redirect('/loginpage')
    }

    // Query admin
    db.query(
        'SELECT * FROM admin WHERE username = ? AND password = ?',
        [username, password],
        (err, adminResult) => {
            if (err) {
                return responsAPI(500, 'Failed to authenticate', 'Internal Server Error', res);
            }

            if (adminResult.length > 0) {
                // Simpan data ke session
                req.session.user = {
                    id: adminResult[0].idAdmin,
                    username: adminResult[0].username,
                    name: adminResult[0].namaAdmin,
                    role: 'admin',
                };
                console.log(req.session.user)
                return res.redirect('/admin/dashboard')
            }

            // Query karyawan jika admin tidak ditemukan
            db.query(
                'SELECT * FROM karyawan WHERE username = ? AND password = ?',
                [username, password],
                (err, karyawanResult) => {
                    if (err) {
                        return responsAPI(500, 'Failed to authenticate', 'Internal Server Error', res);
                    }

                    if (karyawanResult.length > 0) {
                        // Simpan data ke session
                        req.session.user = {
                            id: karyawanResult[0].idKaryawan,
                            username: karyawanResult[0].username,
                            name: karyawanResult[0].namaKaryawan,
                            role: 'karyawan',
                        };
                        
                    return res.redirect('/karyawan/dashboard')
                    }

                    // Jika tidak ada user yang ditemukan
                    return res.status(401).json({
                        success: false,
                        message: 'Invalid credentials',
                        redirectUrl: '/login',
                    });
                }
            );
        }
    );
};

exports.validateKaryawan = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'karyawan') {
        next();
    } else {
        res.redirect('/login');
    }
};

exports.validateAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'admin') {
        next();
    } else {
        res.redirect('/login');
    }
};

exports.logout = (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).send('Failed to log out');
      }
      res.redirect('/login')
    });
  };