const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('userFollow', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    followId: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    user_Id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'userBasic',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'userFollow',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "user_Id",
        using: "BTREE",
        fields: [
          { name: "user_Id" },
        ]
      },
    ]
  });
};
