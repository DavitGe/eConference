import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});
connection.connect((err) => {
    if (err) {
        console.error("Error connecting to the database:", err.stack);
        return;
    }
    console.log("Connected to the MySQL database as id " + connection.threadId);
});
export default connection;
//# sourceMappingURL=database.js.map