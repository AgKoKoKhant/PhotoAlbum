// models/User.js

import { DataTypes, Model } from 'sequelize';
import sequelize from './index.js';
import bcrypt from 'bcrypt';

class User extends Model {
  // Method to compare passwords
  async isValidPassword(password) {
    return await bcrypt.compare(password, this.password);
  }
}

User.init(
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Ensure usernames are unique
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'User',
  }
);

// Hash password before saving to the database
User.beforeCreate(async (user, options) => {
  const saltRounds = 10;
  user.password = await bcrypt.hash(user.password, saltRounds);
});

export default User;
