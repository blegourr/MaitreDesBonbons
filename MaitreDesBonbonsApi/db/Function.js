const mongoose = require('mongoose')
const { Party } = require('../db/config');

module.exports = async client => {
  client.getParty =  async () => {
    const Partys = await Party.findOne();
    return Partys ;
  };

  client.createParty =  async () => {
    const merge = Object.assign({_id: new mongoose.Types.ObjectId()},{
      pool: [],
      users: []
    })
    const configs = new Party(merge)
    return await configs.save();
  },

  client.updateParty = async (settings) => {
    let PartyData = await client.getParty();
    if (typeof PartyData != 'object') PartyData = {};
    for (const key in settings) {
      if (PartyData[key] != settings[key]) PartyData[key] = settings[key]
    };
    return await PartyData.updateOne(settings);
  }

}