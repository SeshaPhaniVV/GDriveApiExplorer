const genericConnObj = {
  host: process.env.DB_HOST_ADDRESS,
  database: process.env.DB_NAME,
  port: process.env.DB_HOST_PORT,
  username: process.env.DB_USER_NAME,
  password: process.env.DB_USER_PWD,
  dialect: "postgres",
  pool: {
    max: process.env.MAX_POOL_SIZE || 20,
    min: process.env.MIN_POOL_SIZE || 5,
  },
  ssl: true,
  dialectOptions: {
    ssl: {
      require: true,
    },
  },
  logging: false,
  minifyAliases: true,
};

const config = {
  development: {
    host: process.env.DB_HOST_ADDRESS || "localhost",
    database: process.env.DB_NAME || "strac_app",
    port: process.env.DB_HOST_PORT || 5432,
    username: process.env.DB_USER_NAME || process.env.USER,
    password: process.env.DB_USER_PWD || "",
    dialect: "postgres",
    logging: false,
    minifyAliases: true,
  },
};

module.exports.default = config;
module.exports = config;
