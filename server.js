const path = require("path");
const express = require("express");

const app = new express();

app.use(express.static(path.resolve(__dirname, "dist")));

app.listen(3543);
console.log("HTTP server started at port 3543");