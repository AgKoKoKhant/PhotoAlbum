import sqlite3 from 'sqlite3';
sqlite3.verbose();


// Connect to the database
const db = new sqlite3.Database('./database.sqlite', sqlite3.OPEN_READONLY, (err) => {
    if (err) {
        console.error("Error connecting to database:", err.message);
    }
});

// Query to fetch all usernames (Change 'users' and 'username' to match your actual table and column names)
db.all("SELECT username FROM users", (err, rows) => {
    if (err) {
        console.error("Error executing query:", err.message);
    } else {
        console.log("Registered Usernames:");
        rows.forEach(row => {
            console.log(row.username);
        });
    }
    db.close();
});