const mongoose = require('mongoose');

const connectDb = async () => {
    const connection = await mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })

    console.log(`Mongo DB Connected: ${connection.connection.host}`)
};

module.exports = connectDb