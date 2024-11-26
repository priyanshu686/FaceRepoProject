const mongoose = require('mongoose');

const dbconnect = async () => {
    await mongoose.connect(process.env.DB_URI).then(() => {
        console.log("Database connected");
    }).catch((error) => {
        console.error("Database connection error:", error);
    });
}

module.exports = dbconnect;