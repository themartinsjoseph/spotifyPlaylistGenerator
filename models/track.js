'use strict';
module.exports = function(sequelize, DataTypes) {
  var track = sequelize.define('track', {
    valence: DataTypes.FLOAT,
    trackId: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return track;
};