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

  up: async (queryInterface) => {
    const environment = process.env.NODE_ENV || "development";
    let clients;

    if (environment === "production") {
      clients = [];
    } else if (environment === "staging" || environment === "test") {
      clients = [];
    } else {
      clients = [
        {
          id: 1,
          client_id: process.env.CLIENT_ID,
          project_id: process.env.PROJECT_ID,
          auth_uri: "https://accounts.google.com/o/oauth2/auth",
          token_uri: "https://oauth2.googleapis.com/token",
          auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
          client_secret: process.env.CLIENT_SECRET,
          redirect_uris: ["http://localhost:3000/api/gdrive/auth/callback"],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
    }

    const insertedClients = await queryInterface.bulkInsert({ tableName: "clients", schema: "oauth" }, clients, {
      returning: true,
      ignoreDuplicates: true,
    });
  },

  down: async (queryInterface) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete({ tableName: "clients", schema: "oauth" }, null, {});
  },
};
