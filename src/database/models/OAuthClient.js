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

class OAuthClient extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
    OAuthClient.hasMany(models.OAuthAccessToken, {
      foreignKey: "client_id",
      as: "tokens",
    });
  }
}

OAuthClient.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    client_id: {
      allowNull: false,
      type: DataTypes.TEXT,
    },
    client_secret: {
      allowNull: false,
      type: DataTypes.TEXT,
    },
    project_id: {
      allowNull: false,
      type: DataTypes.TEXT,
    },
    auth_uri: {
      type: DataTypes.TEXT,
    },
    token_uri: {
      type: DataTypes.TEXT,
    },
    auth_provider_x509_cert_url: {
      type: DataTypes.TEXT,
    },
    redirect_uris: {
      allowNull: false,
      type: DataTypes.ARRAY(DataTypes.TEXT),
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
    modelName: "OAuthClient",
    tableName: "clients",
  }
);

export default OAuthClient;
