import User from './models/User.js';  // Adjust path if necessary
import bcrypt from 'bcrypt';

(async () => {
    try {
        const users = await User.findAll();
        for (let user of users) {
            if (!user.password.startsWith("$2b$")) { // Check if not already hashed
                console.log(`Updating password for user: ${user.username}`);
                const hashedPassword = await bcrypt.hash(user.password, 10);
                await user.update({ password: hashedPassword });
            }
        }
        console.log("Password update complete.");
        process.exit(); // Exit script after running
    } catch (error) {
        console.error("Error updating passwords:", error);
    }
})();
