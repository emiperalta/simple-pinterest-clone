if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const timeago = require('timeago.js');
const flash = require('express-flash');
const passport = require('passport');
const session = require('express-session');
const methodOverride = require('method-override');

const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');

const app = express();
const port = process.env.PORT;

mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.once('open', () => console.log('DB is connected'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('dev'));
app.use((req, res, next) => {
    app.locals.format = timeago.format;
    next();
})

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'public/img/uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, uuidv4() + path.extname(file.originalname));
    }
});

app.use(multer({ storage: storage }).single('image'));
app.use(flash());
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'))

app.use('/', indexRouter);
app.use('/user', userRouter);
app.get('/user', (req, res) => res.redirect('/'));

app.listen(port);