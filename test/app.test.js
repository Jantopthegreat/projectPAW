const { isAuthicated, validateKaryawan, validateAdmin, logout } = require('../src/app/middleware/auth');
const db = require('../src/app/infrastructure/database/connection');

jest.mock('../src/app/infrastructure/database/connection');

// Unit testing Anda di sini...


describe('Auth Controller', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            body: {},
            session: {},
        };

        res = {
            redirect: jest.fn(),
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };

        next = jest.fn();
    });

    describe('isAuthicated', () => {
        it('should redirect to /loginpage if username or password is missing', () => {
            req.body = { username: '', password: '' };

            isAuthicated(req, res);

            expect(res.redirect).toHaveBeenCalledWith('/loginpage');
        });

        it('should authenticate admin and redirect to /admin/dashboard', () => {
            req.body = { username: 'adminUser', password: 'adminPass' };
            db.query.mockImplementation((query, values, callback) => {
                if (query.includes('admin')) {
                    callback(null, [{ idAdmin: 1, username: 'adminUser', namaAdmin: 'Admin Name' }]);
                }
            });

            isAuthicated(req, res);

            setTimeout(() => {
                expect(req.session.user).toEqual({
                    id: 1,
                    username: 'adminUser',
                    name: 'Admin Name',
                    role: 'admin',
                });
                expect(res.redirect).toHaveBeenCalledWith('/admin/dashboard');
            }, 0);
        });

        it('should authenticate karyawan and redirect to /karyawan/dashboard', () => {
            req.body = { username: 'karyawanUser', password: 'karyawanPass' };
            db.query.mockImplementation((query, values, callback) => {
                if (query.includes('admin')) {
                    callback(null, []);
                } else if (query.includes('karyawan')) {
                    callback(null, [{ idKaryawan: 2, username: 'karyawanUser', namaKaryawan: 'Karyawan Name' }]);
                }
            });

            isAuthicated(req, res);

            setTimeout(() => {
                expect(req.session.user).toEqual({
                    id: 2,
                    username: 'karyawanUser',
                    name: 'Karyawan Name',
                    role: 'karyawan',
                });
                expect(res.redirect).toHaveBeenCalledWith('/karyawan/dashboard');
            }, 0);
        });

        it('should return 401 if credentials are invalid', () => {
            req.body = { username: 'invalidUser', password: 'invalidPass' };
            db.query.mockImplementation((query, values, callback) => {
                callback(null, []);
            });

            isAuthicated(req, res);

            setTimeout(() => {
                expect(res.status).toHaveBeenCalledWith(401);
                expect(res.json).toHaveBeenCalledWith({
                    success: false,
                    message: 'Invalid credentials',
                    redirectUrl: '/login',
                });
            }, 0);
        });
    });

    describe('validateKaryawan', () => {
        it('should call next if user role is karyawan', () => {
            req.session.user = { role: 'karyawan' };

            validateKaryawan(req, res, next);

            expect(next).toHaveBeenCalled();
        });

        it('should redirect to /login if user role is not karyawan', () => {
            req.session.user = { role: 'admin' };

            validateKaryawan(req, res, next);

            expect(res.redirect).toHaveBeenCalledWith('/login');
        });
    });

    describe('validateAdmin', () => {
        it('should call next if user role is admin', () => {
            req.session.user = { role: 'admin' };

            validateAdmin(req, res, next);

            expect(next).toHaveBeenCalled();
        });

        it('should redirect to /login if user role is not admin', () => {
            req.session.user = { role: 'karyawan' };

            validateAdmin(req, res, next);

            expect(res.redirect).toHaveBeenCalledWith('/login');
        });
    });

});
