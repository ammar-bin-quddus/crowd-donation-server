require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

// middleware 

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send("crowd donation server running");
})

app.listen(port, (req, res) => {
    console.log(`server running on port: ${port}`)
})