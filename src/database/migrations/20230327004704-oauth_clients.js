/**
 * @typedef {import('sequelize').Sequelize} Sequelize
 * @typedef {import('sequelize').QueryInterface} QueryInterface
 */

export default {
  /**
   * @param {QueryInterface} queryInterface
   * @param {Sequelize} Sequelize
   * @returns
   */
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      "clients",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        client_id: {
          allowNull: false,
          type: Sequelize.TEXT,
        },
        client_secret: {
          allowNull: false,
          type: Sequelize.TEXT,
        },
        project_id: {
          allowNull: false,
          type: Sequelize.TEXT,
        },
        auth_uri: {
          type: Sequelize.TEXT,
        },
        token_uri: {
          type: Sequelize.TEXT,
        },
        auth_provider_x509_cert_url: {
          type: Sequelize.TEXT,
        },
        redirect_uris: {
          allowNull: false,
          type: Sequelize.ARRAY(Sequelize.TEXT),
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
      },
      {
        schema: "oauth",
      }
    );
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable({ tableName: "clients", schema: "oauth" });
  },
};
