var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BankAccountSchema = new Schema({
  balance: {
    type: Number,
    required: true,
    default: Math.floor(Math.random()*1000) + 100
  },

  owner: {type: Schema.Types.ObjectId, ref: 'user'}

});

module.exports = mongoose.model('bankAccount', BankAccountSchema);
