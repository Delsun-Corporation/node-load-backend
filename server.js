const express = require('express');
const morgan = require('morgan');
const connectDb = require('./config/db');

const app = express();

require('dotenv').config({
    path: './config/config.env'
})

// Connect to Database
connectDb();

app.use(
    express.urlencoded({
        extended: true
    })
)

app.use(express.json())

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
