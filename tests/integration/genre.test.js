const { expect } = require("chai");
const request = require("supertest");
const { Genre } = require("../../src/models");
const app = require("../../src/app");
const dataFactory = require("../helpers/dataFactory");

describe("/genres", () => {
  before(async () => Genre.sequelize.sync());

  beforeEach(async () => {
    await Genre.destroy({ where: {} });
  });

  describe("with no records in the database", () => {
    describe("POST /genres", () => {
      it("creates a new genre in the database", async () => {
        const getGenreData = dataFactory.genreData();

        const response = await request(app).post("/genres").send({
          genre: getGenreData.genre,
        });

        const newGenreRecord = await Genre.findByPk(response.body.id, {
          raw: true,
        });

        expect(response.status).to.equal(201);
        expect(response.body.genre).to.equal(getGenreData.genre);
        expect(newGenreRecord.genre).to.equal(getGenreData.genre);
      });

      it("returns an error if name has no characters", async () => {
        const response = await request(app).post("/genres").send({
          genre: "",
        });

        expect(response.status).to.equal(400);
        expect(response.body).to.equal(`"genre" is not allowed to be empty`);
      });
    });
  });

  describe("with records in the database", () => {
    let genres;

    beforeEach(async () => {
      const genreExamples = [];

      for (let i = 0; i < 3; i++) {
        genreExamples.push(dataFactory.genreData());
      }

      genres = await Promise.all(
        genreExamples.map(async (genre) => Genre.create(genre))
      );
    });

    describe("GET /genres", () => {
      it("gets all genre records", async () => {
        const response = await request(app).get("/genres");

        expect(response.status).to.equal(200);
        expect(response.body.length).to.equal(3);

        response.body.forEach((genre) => {
          const expected = genres.find((a) => a.id === genre.id);

          expect(genre.genre).to.equal(expected.genre);
        });
      });
    });

    describe("GET /genres/:id", () => {
      it("gets genre record by id", async () => {
        const genre = genres[0];
        const response = await request(app).get(`/genres/${genre.id}`);

        expect(response.status).to.equal(200);
        expect(response.body.genre).to.equal(genre.genre);
      });

      it("returns a 404 if the genre does not exist", async () => {
        const response = await request(app).get("/genres/12345");

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal("The genre could not be found.");
      });
    });

    describe("PATCH /genres/:id", () => {
      it("updates genre by id", async () => {
        const genre = genres[0];
        const response = await request(app)
          .patch(`/genres/${genre.id}`)
          .send({ genre: "Fantasy" });
        const updatedGenreRecord = await Genre.findByPk(genre.id, {
          raw: true,
        });

        expect(response.status).to.equal(200);
        expect(updatedGenreRecord.genre).to.equal("Fantasy");
      });

      it("returns a 404 if the genre does not exist", async () => {
        const response = await request(app)
          .patch("/genres/12345")
          .send({ genre: "this_false_genre" });

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal(
          "genre ID (12345) could not be found."
        );
      });

      it(`doesn't patch if a field isn't valid`, async () => {
        const genre = genres[0];
        const response = await request(app)
          .patch(`/genres/${genre.id}`)
          .send({ genre: "F" });

        expect(response.status).to.equal(400);
        expect(response.body).to.equal(
          `"genre" length must be at least 2 characters long`
        );
      });
    });

    describe("DELETE /genres/:id", () => {
      it("deletes genre record by id", async () => {
        const genre = genres[0];
        const response = await request(app).delete(`/genres/${genre.id}`);
        const deletedGenre = await Genre.findByPk(genre.id, { raw: true });

        expect(response.status).to.equal(204);
        expect(deletedGenre).to.equal(null);
      });

      it("returns a 404 if the genre does not exist", async () => {
        const response = await request(app).delete("/genres/12345");
        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal("The genre could not be found.");
      });
    });
  });
});
