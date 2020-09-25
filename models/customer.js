'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Customer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Customer.hasMany(models.Reservation)
    }
  };
  Customer.init({
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    cni: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'Customer',
  });
  return Customer;
};