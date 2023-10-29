const mongoose = require("mongoose");

const poolSchema = new mongoose.Schema({
  poolID: String,
  users: {
    type: Map,
    of: {
      userId: String,
      socketEmitUser: String,
      avatar: String,
      name: String,
    },
  },
});

module.exports = mongoose.model('Pool', poolSchema);
