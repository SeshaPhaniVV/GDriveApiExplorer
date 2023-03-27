import { Model, DataTypes } from "sequelize";
import getPostgresDb from "@loaders/db";

const sequelize = getPostgresDb();
/**
 * @typedef {import('@main/models').Sequelize} Sequelize
 * @typedef {import('sequelize/types')} DataTypes
 */

/**
 * @param {DataTypes} DataTypes
 * @param {Sequelize} sequelize
 * @returns
 */

class OAuthAccessToken extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
    OAuthAccessToken.belongsTo(models.OAuthClient, {
      foreignKey: "client_id",
    });
  }
}

OAuthAccessToken.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    access_token: {
      allowNull: false,
      type: DataTypes.TEXT,
    },
    client_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: "clients",
        key: "id",
        as: "client_id",
      },
    },
    scopes: {
      allowNull: false,
      type: DataTypes.ARRAY(DataTypes.TEXT),
    },
    expires: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    schema: "oauth",
    modelName: "OAuthAccessToken",
    tableName: "access_tokens",
  }
);

export default OAuthAccessToken;
