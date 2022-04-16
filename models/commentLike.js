const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('commentLike', {
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
    comment_Id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'comment',
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
    tableName: 'commentLike',
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
        name: "comment_Id",
        using: "BTREE",
        fields: [
          { name: "comment_Id" },
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
