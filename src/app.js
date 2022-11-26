const express = require("express");
const readerRouter = require("./Routes/readerRouter");
const bookRouter = require("./Routes/bookRouter");
const genreRouter = require("./Routes/genreRouter");
const authorRouter = require("./Routes/authorRouter");

const app = express();

app.use(express.json());

app.use("/readers", readerRouter);
app.use("/books", bookRouter);
app.use("/genres", genreRouter);
app.use("/authors", authorRouter);

module.exports = app;
