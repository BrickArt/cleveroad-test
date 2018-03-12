const mongoose = require("mongoose");
const config = require('../config/index.config');

mongoose.Promise = require("bluebird");

mongoose.connect(config.MONGOOSE_URI);

mongoose.connection.on("connected", function() {
  console.log("DB connected");
});

module.exports = mongoose;
