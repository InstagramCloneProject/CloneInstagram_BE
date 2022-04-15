const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('feed', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    feedImg: {
      type: DataTypes.STRING(250),
      allowNull: false
    },
    content: {
      type: DataTypes.STRING(300),
      allowNull: false
    },
    feed_Id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'userBasic',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'feed',
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
        name: "feed_Id",
        using: "BTREE",
        fields: [
          { name: "feed_Id" },
        ]
      },
    ]
  });
};
