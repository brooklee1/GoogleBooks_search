const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  title: { type: String, required: true },
  authors: { type: String, required: true },
  description: String,
  date: { type: Date, default: Date.now },
  googleId: { type: String, required: true, unique: true }
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
