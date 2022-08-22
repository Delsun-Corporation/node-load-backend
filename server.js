const express = require('express');
const morgan = require('morgan');
const connectDb = require('./config/db');
const bodyParser = require('body-parser');
var multer = require('multer');

var upload = multer();
const app = express();

require('dotenv').config({
    path: './config/config.env'
})

// Connect to Database
connectDb();

app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json({limit: '50mb'}));
// for parsing multipart/form-data
app.use(upload.array()); 
app.use(express.static('public'));
app.use('/api/uploads', express.static('uploads'));

// Config for only development
if(process.env.NODE_ENV == 'development') {
    app.use(morgan('dev'));
} else {
    // Add function here
}

const authRouter = require('./routes/auth.route.js');
const accountRouter = require('./routes/account.route.js');
const settingsRouter = require('./routes/settings.route.js');
const libraryRouter = require('./routes/libraries.route.js');

app.use('/api/', authRouter);
app.use('/api/setting/', accountRouter);
app.use('/api/setting/', settingsRouter);
app.use('/api/library/', libraryRouter);
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: 'Page not found'
    })
})

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`App listening to PORT ${PORT}`)
});
