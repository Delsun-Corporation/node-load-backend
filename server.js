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
app.use(bodyParser.json());
// for parsing multipart/form-data
app.use(upload.array()); 
app.use(express.static('public'));

// Config for only development
if(process.env.NODE_ENV == 'development') {
    app.use(morgan('dev'));
} else {
    // Add function here
}

const authRouter = require('./routes/auth.route.js');

app.use('/api/', authRouter);
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
