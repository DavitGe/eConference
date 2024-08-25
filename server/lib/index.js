import express from "express";
import dotenv from "dotenv";
import connection from "./database";
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
app.get("/", (_, res) => {
    connection.query("SELECT * FROM your_table_name", (err, results) => {
        if (err) {
            console.error("Error fetching data:", err.stack);
            res.status(500).send("Error fetching data");
            return;
        }
        res.json(results);
    });
});
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map