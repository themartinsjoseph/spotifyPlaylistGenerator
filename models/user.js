'use strict';
var bcrypt = require('bcrypt');

module.exports = function(sequelize, DataTypes) {
  var user = sequelize.define('user', {
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: {
          msg: 'Invalid email address'
        }
      }
    },
    userName: DataTypes.STRING,
    password: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [4, 20],
          msg: 'Password must be between 4 and 20 characters long'
        }
      }
    },
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    birthDay: DataTypes.INTEGER,
    birthMonth: DataTypes.INTEGER
  }, {
    hooks: {
      beforeCreate: function(createdUser, options, cb){
        if(createdUser && createdUser.password){
          var hash = bcrypt.hashSync(createdUser.password, 10);
        createdUser.password = hash;  //Change the password to the hash value before inserting to the DB
        }
        cb(null, createdUser);
      }
    }, 
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    },
    instanceMethods: {
      validPassword: function(passwordTyped){
        return bcrypt.compareSync(passwordTyped, this.password);
      },
      toJSON: function(){
        var data = this.get(); 
        delete data.password; 
        return data; 
      }
    }
  });
  return user;
};