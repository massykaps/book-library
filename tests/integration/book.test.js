const { expect } = require("chai");
const request = require("supertest");
const { Book } = require("../../src/models");
const app = require("../../src/app");
const dataFactory = require("../helpers/dataFactory");

describe("/books", () => {
  before(async () => Book.sequelize.sync());

  beforeEach(async () => {
    await Book.destroy({ where: {} });
  });

  describe("with no books in the database", () => {
    describe("POST", () => {
      it("creates a book", async () => {
        const getBookData = dataFactory.bookData();

        const response = await request(app).post("/books").send({
          title: getBookData.title,
          isbn: getBookData.isbn,
        });

        expect(response.status).to.equal(201);
        expect(response.body.title).to.equal(getBookData.title);
        expect(response.body.isbn).to.equal(getBookData.isbn);

        const bookDocument = await Book.findByPk(response.body.id, {
          raw: true,
        });

        expect(bookDocument.title).to.equal(getBookData.title);
        expect(bookDocument.isbn).to.equal(getBookData.isbn);
      });

      it("returns an error if title is empty", async () => {
        const bookData = dataFactory.bookData();

        const response = await request(app).post("/books").send({
          title: "",
          isbn: bookData.isbn,
        });

        expect(response.status).to.equal(400);
        expect(response.body).to.equal(`"title" is not allowed to be empty`);
      });
    });
  });

  describe("with records in the database", () => {
    let books;

    beforeEach(async () => {
      const bookExamples = [];
      const existingIsbns = [];
      while (bookExamples.length < 3) {
        const newBook = dataFactory.bookData();
        if (!existingIsbns.includes(newBook.isbn)) {
          bookExamples.push(newBook);
          existingIsbns.push(newBook.isbn);
        }
      }
      books = await Promise.all(
        bookExamples.map(async (book) => Book.create(book))
      );
    });

    describe("GET /books", () => {
      it("gets all books records", async () => {
        const response = await request(app).get("/books");

        expect(response.status).to.equal(200);
        expect(response.body.length).to.equal(3);

        response.body.forEach((book) => {
          const expected = books.find((a) => a.id === book.id);

          expect(book.title).to.equal(expected.title);
          expect(book.isbn).to.equal(expected.isbn);
        });
      });
    });

    describe("GET /books/:id", () => {
      it("gets book records by id", async () => {
        const book = books[0];

        const response = await request(app).get(`/books/${book.id}`);

        expect(response.status).to.equal(200);
        expect(response.body.title).to.equal(book.title);
        expect(response.body.isbn).to.equal(book.isbn);
      });

      it("returns a 404 if the book does not exist", async () => {
        const response = await request(app).get("/books/12345");

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal("The book could not be found.");
      });
    });

    describe("PATCH /books/:id", () => {
      it("updates books by id", async () => {
        const currentBookInfo = books[0];
        const readerRecord = await Book.findByPk(currentBookInfo.id, {
          raw: true,
        });
        const newBookInfo = dataFactory.bookData();

        const response = await request(app)
          .patch(`/books/${currentBookInfo.id}`)
          .send(newBookInfo);

        const updatedReaderRecord = await Book.findByPk(currentBookInfo.id, {
          raw: true,
        });

        expect(response.status).to.equal(200);
        expect(updatedReaderRecord.title).not.to.equal(readerRecord.title);
        expect(updatedReaderRecord.isbn).not.to.equal(readerRecord.isbn);
      });

      it("returns a 404 if the book does not exist", async () => {
        const response = await request(app)
          .patch(`/books/12345`)
          .send({ title: "some_new_book" });

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal(
          `book ID (12345) could not be found.`
        );
      });

      it("returns an error if title is empty", async () => {
        const currentBookInfo = books[0];

        const bookData = dataFactory.bookData();

        const response = await request(app)
          .patch(`/books/${currentBookInfo.id}`)
          .send({
            title: "",
            isbn: bookData.isbn,
          });

        expect(response.status).to.equal(400);
        expect(response.body).to.equal(`"title" is not allowed to be empty`);
      });

      it("returns an error if isbn isn't unique", async () => {
        const book1 = books[0];
        const book2 = books[1];

        const response = await request(app).patch(`/books/${book1.id}`).send({
          isbn: book2.isbn,
        });

        expect(response.status).to.equal(400);
      });
    });
    describe("DELETE /books/:id", () => {
      it("deletes book record", async () => {
        const book = books[0];
        const response = await request(app).delete(`/books/${book.id}`);
        const deletedBook = await Book.findByPk(book.id, { raw: true });

        expect(response.status).to.equal(204);
        expect(deletedBook).to.equal(null);
      });

      it("returns a 404 if the book does not exist", async () => {
        const response = await request(app).delete("/books/12345");

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal("The book could not be found.");
      });
    });
  });
});
