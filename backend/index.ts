import express from "express";
import products from "./data/products.js";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

dotenv.config();
const port = process.env.PORT || 4000;
const app = express();

await connectDB();

app.get("/", (req, res) => {
    res.send("API is running...");
});

app.get('/api/products', (req, res) => {
    res.json(products);
});

app.get('/api/products/:name', (req, res) => {
    const product = products.find(p => p.name === req.params.name);
    res.json(product)
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
