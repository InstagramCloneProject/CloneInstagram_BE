const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('recommentLike', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    likeId: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    recomment_Id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'recomment',
        key: 'id'
      }
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
    tableName: 'recommentLike',
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
        name: "recommentLike_ibfk_1",
        using: "BTREE",
        fields: [
          { name: "recomment_Id" },
        ]
      },
      {
        name: "recommentLike_ibfk_2",
        using: "BTREE",
        fields: [
          { name: "user_Id" },
        ]
      },
    ]
  });
};
