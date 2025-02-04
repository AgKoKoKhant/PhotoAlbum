import { DataTypes } from 'sequelize';
import sequelize from './index.js';
// import bcrypt from 'bcrypt';
import bcrypt from 'bcryptjs';

const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('admin', 'user'),
        defaultValue: 'user' // Default role is 'user'
    }
});

// Hash password before saving user
User.beforeCreate(async (user) => {
    if (!user.password.startsWith("$2b$")) { // Avoid rehashing an already hashed password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
    }
});

// Hash password before updating (e.g., password change)
User.beforeUpdate(async (user) => {
    if (!user.password.startsWith("$2b$")) { // Avoid rehashing if already hashed
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
    }
});

// Add method to compare passwords
User.prototype.isValidPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

export default User;
