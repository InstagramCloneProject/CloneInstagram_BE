const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('feedLike', {
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
    tableName: 'feedLike',
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
        name: "feedLike_ibfk_1",
        using: "BTREE",
        fields: [
          { name: "user_Id" },
        ]
      },
      {
        name: "feedLike_ibfk_2",
        using: "BTREE",
        fields: [
          { name: "feed_Id" },
        ]
      },
    ]
  });
};
