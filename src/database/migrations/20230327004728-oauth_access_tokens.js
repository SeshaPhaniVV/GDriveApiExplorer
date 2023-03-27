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
      "access_tokens",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        access_token: {
          allowNull: false,
          type: Sequelize.TEXT,
        },
        refresh_token: {
          type: Sequelize.TEXT,
        },
        client_id: {
          allowNull: false,
          type: Sequelize.INTEGER,
          references: {
            model: "clients",
            key: "id",
          },
        },
        scopes: {
          allowNull: false,
          type: Sequelize.ARRAY(Sequelize.TEXT),
        },
        expires: {
          allowNull: false,
          type: Sequelize.TEXT,
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
    await queryInterface.dropTable({
      tableName: "access_tokens",
      schema: "oauth",
    });
  },
};
