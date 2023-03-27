import Sequelize from "sequelize";

const postgresDb = new Sequelize("test_strac_app", "postgres", "password", {
  host: "localhost",
  port: "5432",
  dialect: "postgres",
  logging: false,
});

export default class DBHelper {
  static async connect() {
    await postgresDb.authenticate();
  }

  static async close() {
    await postgresDb.close();
  }
}
