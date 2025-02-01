// models/index.js

import { Sequelize } from 'sequelize';
import path from 'path';
import { fileURLToPath } from 'url';

// ES module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Sequelize
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../database.sqlite'), // Database file location
  logging: false, // Disable logging; default: console.log
});

export default sequelize;
