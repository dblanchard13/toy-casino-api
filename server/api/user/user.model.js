var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },

  // password is hashed before being saved, of course.
  password: {
    type: String,
    required: true
  },

  pocketMoney: {
    type: Number,
    default: Math.floor(Math.random()*100)
  },

  accounts: [{type: Schema.Types.ObjectId, ref: 'bankAccount'}]

});

UserSchema.pre('save', function(next) {
  if (!this.isModified('password')) return next();


  this.password = this.encryptPassword(this.password);
  next();
})

UserSchema.methods = {
  // check the passwords on signin
  authenticate: function(plainTextPassword) {
    return bcrypt.compareSync(plainTextPassword, this.password);
  },
  // hash the passwords
  encryptPassword: function(plainTextPassword) {
    if (!plainTextPassword) {
      return ''
    } else {
      var salt = bcrypt.genSaltSync(10);
      return bcrypt.hashSync(plainTextPassword, salt);
    }
  },

  toJson: function() {
    var obj = this.toObject()
    delete obj.password;
    return obj;
  }
};


module.exports = mongoose.model('user', UserSchema);
