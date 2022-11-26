const { expect } = require("chai");
const request = require("supertest");
const { Author } = require("../../src/models");
const app = require("../../src/app");
const dataFactory = require("../helpers/dataFactory");

describe("/authors", () => {
  before(async () => Author.sequelize.sync());

  beforeEach(async () => {
    await Author.destroy({ where: {} });
  });

  describe("with no records in the database", () => {
    describe("POST /authors", () => {
      it("creates a new author in the database", async () => {
        const getAuthorData = dataFactory.authorData();

        const response = await request(app).post("/authors").send({
          author: getAuthorData.author,
        });

        const newAuthorRecord = await Author.findByPk(response.body.id, {
          raw: true,
        });

        expect(response.status).to.equal(201);
        expect(response.body.author).to.equal(getAuthorData.author);
        expect(newAuthorRecord.author).to.equal(getAuthorData.author);
      });

      it("returns an error if name has no characters", async () => {
        const response = await request(app).post("/authors").send({
          author: "",
        });

        expect(response.status).to.equal(400);
        expect(response.body).to.equal(`"author" is not allowed to be empty`);
      });
    });
  });

  describe("with records in the database", () => {
    let authors;

    beforeEach(async () => {
      const authorExamples = [];

      for (let i = 0; i < 3; i++) {
        authorExamples.push(dataFactory.authorData());
      }

      authors = await Promise.all(
        authorExamples.map(async (author) => Author.create(author))
      );
    });

    describe("GET /authors", () => {
      it("gets all author records", async () => {
        const response = await request(app).get("/authors");

        expect(response.status).to.equal(200);
        expect(response.body.length).to.equal(3);

        response.body.forEach((author) => {
          const expected = authors.find((a) => a.id === author.id);

          expect(author.author).to.equal(expected.author);
        });
      });
    });

    describe("GET /authors/:id", () => {
      it("gets author record by id", async () => {
        const author = authors[0];
        const response = await request(app).get(`/authors/${author.id}`);

        expect(response.status).to.equal(200);
        expect(response.body.author).to.equal(author.author);
      });

      it("returns a 404 if the author does not exist", async () => {
        const response = await request(app).get("/authors/12345");

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal("The author could not be found.");
      });
    });

    describe("PATCH /authors/:id", () => {
      it("updates author by id", async () => {
        const author = authors[0];
        const response = await request(app)
          .patch(`/authors/${author.id}`)
          .send({ author: "J.K Rowling" });
        const updatedAuthorRecord = await Author.findByPk(author.id, {
          raw: true,
        });

        expect(response.status).to.equal(200);
        expect(updatedAuthorRecord.author).to.equal("J.K Rowling");
      });

      it("returns a 404 if the author does not exist", async () => {
        const response = await request(app)
          .patch("/authors/12345")
          .send({ author: "this_guy" });

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal(
          "author ID (12345) could not be found."
        );
      });

      it(`doesn't patch if a field isn't valid`, async () => {
        const author = authors[0];
        const response = await request(app)
          .patch(`/authors/${author.id}`)
          .send({ author: "F" });

        expect(response.status).to.equal(400);
        expect(response.body).to.equal(
          `"author" length must be at least 2 characters long`
        );
      });
    });

    describe("DELETE /authors/:id", () => {
      it("deletes author record by id", async () => {
        const author = authors[0];
        const response = await request(app).delete(`/authors/${author.id}`);
        const deletedAuthor = await Author.findByPk(author.id, { raw: true });

        expect(response.status).to.equal(204);
        expect(deletedAuthor).to.equal(null);
      });

      it("returns a 404 if the author does not exist", async () => {
        const response = await request(app).delete("/authors/12345");
        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal("The author could not be found.");
      });
    });
  });
});
