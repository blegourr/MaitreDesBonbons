const mongoose = require("mongoose");

const poolSchema = new mongoose.Schema({
  poolID: String,
  users: {
    type: Map,
    of: {
      userId: String,
    },
  },
});

module.exports = mongoose.model('Pool', poolSchema);
