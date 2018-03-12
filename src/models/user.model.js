const crypto = require('crypto');

const mongoose = require('../lib/mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  email: {
    type: String,
    required: true
  },
  name: {
    type: String
  },
  phone: {
    type: String
  },
  hashedPassword: {
    type: String,
    required: true
  },
  salt: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  }
});

schema.methods.encryptPassword = function (password) {
  return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};

schema.virtual('password')
  .set(function (password) {
    this._plainPassword = password;
    this.salt = Math.random() + '';
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function () { return this._plainPassword; });


schema.methods.checkPassword = function (password) {
  return this.encryptPassword(password) === this.hashedPassword;
};

schema.methods.getPublicFields = function() {
  return {
    id: this._id.toString(),
    name: this.name,
    email: this.email,
    phone: this.phone
  };
};

exports.User = mongoose.model("User", schema);
