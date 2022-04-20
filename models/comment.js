const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('comment', {
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
    feed_Id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'feed',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'comment',
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
        name: "comment_ibfk_1",
        using: "BTREE",
        fields: [
          { name: "user_Id" },
        ]
      },
      {
        name: "comment_ibfk_2",
        using: "BTREE",
        fields: [
          { name: "feed_Id" },
        ]
      },
    ]
  });
};
