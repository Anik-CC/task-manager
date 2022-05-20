const mongoose = require('mongoose')
mongoose.connect(process.env.MONGODB_CONNECTION);

module.exports = mongoose;