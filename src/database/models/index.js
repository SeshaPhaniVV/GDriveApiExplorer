/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
import 'dotenv/config';
import 'module-alias/register';
import fs from 'fs';
import path from 'path';
import { Sequelize } from 'sequelize';
import connectToPostgresDB from '@loaders/db';

const basename = path.basename(__filename);
const db = {};
const sequelize = connectToPostgresDB();

fs.readdirSync(__dirname)
  .filter((file) => file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js')
  .forEach((file) => {
    const model = require(path.join(__dirname, file)).default;
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
