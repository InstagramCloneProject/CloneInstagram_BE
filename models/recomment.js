const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('recomment', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    content: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    user_Id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'userBasic',
        key: 'id'
      }
    },
    comment_Id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'comment',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'recomment',
    timestamps: true,
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
      {
        name: "comment_Id",
        using: "BTREE",
        fields: [
          { name: "comment_Id" },
        ]
      },
    ]
  });
};
