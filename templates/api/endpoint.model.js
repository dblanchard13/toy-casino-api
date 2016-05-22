var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var <%= upCaseName %>Schema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },

  text: {
    type: String,
    required: true
  },

  // Reference for foreign key
  author: {type: Schema.Types.ObjectId, ref: 'user'},

  // Reference for one to many
  categories: [{type: Schema.Types.ObjectId, ref: 'category'}]
});

module.exports = mongoose.model('<%= name %>', <%= upCaseName %>Schema);
