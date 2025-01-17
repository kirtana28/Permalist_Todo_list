/*
import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "Permalist",
  password: "Kirtana28.",
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];

app.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM items ORDER BY id ASC");
    items = result.rows;

    res.render("index.ejs", {
      listTitle: "Today",
      listItems: items,
    });
  } catch (err) {
    console.log(err);
  }
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  // items.push({title: item});
  try {
    await db.query("INSERT INTO items (title) VALUES ($1)", [item]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.post("/edit", async (req, res) => {
  const item = req.body.updatedItemTitle;
  const id = req.body.updatedItemId;

  try {
    await db.query("UPDATE items SET title = ($1) WHERE id = $2", [item, id]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.post("/delete", async (req, res) => {
  const id = req.body.deleteItemId;
  try {
    await db.query("DELETE FROM items WHERE id = $1", [id]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
*/

import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();  

const app = express();
const port = process.env.PORT || 3000;  // Use a dynamic port for deployment if available

// Database connection using environment variables
const db = new pg.Client({
  user: process.env.DB_USER,        // Matches .env key
  host: process.env.DB_HOST,        // Matches .env key
  database: process.env.DB_NAME,    // Matches .env key
  password: process.env.DB_PASSWORD,// Matches .env key
  port: process.env.DB_PORT         // Matches .env key
});

db.connect()
  .then(() => console.log("Connected to the database"))
  .catch((err) => console.error("Database connection error:", err));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Routes
app.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM items ORDER BY id ASC");
    res.render("index.ejs", {
      listTitle: "Today",
      listItems: result.rows
    });
  } catch (err) {
    console.error("Error fetching items:", err);
    res.status(500).send("Internal server error");
  }
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  try {
    await db.query("INSERT INTO items (title) VALUES ($1)", [item]);
    res.redirect("/");
  } catch (err) {
    console.error("Error adding item:", err);
    res.status(500).send("Internal server error");
  }
});

app.post("/edit", async (req, res) => {
  const item = req.body.updatedItemTitle;
  const id = req.body.updatedItemId;
  try {
    await db.query("UPDATE items SET title = $1 WHERE id = $2", [item, id]);
    res.redirect("/");
  } catch (err) {
    console.error("Error updating item:", err);
    res.status(500).send("Internal server error");
  }
});

app.post("/delete", async (req, res) => {
  const id = req.body.deleteItemId;
  try {
    await db.query("DELETE FROM items WHERE id = $1", [id]);
    res.redirect("/");
  } catch (err) {
    console.error("Error deleting item:", err);
    res.status(500).send("Internal server error");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
