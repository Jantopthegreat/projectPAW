const express = require('express');
const cors = require('cors');
const session = require('express-session');
const path = require('path')
const application =  require('./src/app/routes/index')
require('dotenv').config()
const port = process.env.PORT;

const app = express();

app.set('views', path.join(__dirname, 'src/views/'))
app.set('view engine','ejs');
app.use(express.urlencoded({extended : true}))

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false }
    })
);

const corsOptions ={
    origin : 'localhost:3001',
    methods : ['GET'],
    allowHeaders: ['Content-Type']
}


app.use(express.static(path.join(__dirname, '/src/public')));
app.use(cors(corsOptions));
app.use('/',application)

// interface
app.get('/loginpage', (req, res) => {
    res.render('index')
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});