// index.mjs
import { app } from "./app.mjs";
import dotenv from "dotenv";
import { db } from "./db/db.mjs";
dotenv.config();
const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
db()
