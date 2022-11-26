const { expect } = require("chai");
const request = require("supertest");
const { Reader } = require("../../src/models");
const app = require("../../src/app");
const dataFactory = require("../helpers/dataFactory");

describe("/readers", () => {
  before(async () => Reader.sequelize.sync());

  beforeEach(async () => {
    await Reader.destroy({ where: {} });
  });

  describe("with no records in the database", () => {
    describe("POST /readers", () => {
      it("creates a new reader in the database", async () => {
        const getReaderData = dataFactory.readerData();

        const response = await request(app).post("/readers").send({
          name: getReaderData.name,
          email: getReaderData.email,
          password: getReaderData.password,
        });

        const newReaderRecord = await Reader.findByPk(response.body.id, {
          raw: true,
        });

        expect(response.status).to.equal(201);
        expect(response.body.name).to.equal(getReaderData.name);
        expect(newReaderRecord.name).to.equal(getReaderData.name);
        expect(newReaderRecord.email).to.equal(getReaderData.email);
      });

      it("returns an error if name has no characters", async () => {
        const getReaderData = dataFactory.readerData();

        const response = await request(app).post("/readers").send({
          name: "",
          email: getReaderData.email,
          password: getReaderData.password,
        });

        expect(response.status).to.equal(400);
        expect(response.body).to.equal(`"name" is not allowed to be empty`);
      });

      it("returns an error if email not valid", async () => {
        const getReaderData = dataFactory.readerData();

        const response = await request(app).post("/readers").send({
          name: getReaderData.name,
          email: "future_ms_darcygmail.com",
          password: getReaderData.password,
        });

        expect(response.status).to.equal(400);
        expect(response.body).to.equal(`"email" must be a valid email`);
      });

      it("returns an error if password is less than 8 characters", async () => {
        const getReaderData = dataFactory.readerData();

        const response = await request(app).post("/readers").send({
          name: getReaderData.name,
          email: getReaderData.email,
          password: "pass",
        });

        expect(response.status).to.equal(400);
        expect(response.body).to.equal(
          `"password" length must be at least 8 characters long`
        );
      });
    });
  });

  describe("with records in the database", () => {
    let readers;

    beforeEach(async () => {
      const readerExamples = [];

      for (let i = 0; i < 3; i++) {
        readerExamples.push(dataFactory.readerData());
      }

      readers = await Promise.all(
        readerExamples.map(async (reader) => Reader.create(reader))
      );
    });

    describe("GET /readers", () => {
      it("gets all readers records", async () => {
        const response = await request(app).get("/readers");

        expect(response.status).to.equal(200);
        expect(response.body.length).to.equal(3);

        response.body.forEach((reader) => {
          const expected = readers.find((a) => a.id === reader.id);

          expect(reader.name).to.equal(expected.name);
          expect(reader.email).to.equal(expected.email);
          expect(response.body.password).to.equal(undefined);
        });
      });
    });

    describe("GET /readers/:id", () => {
      it("gets readers record by id", async () => {
        const reader = readers[0];
        const response = await request(app).get(`/readers/${reader.id}`);

        expect(response.status).to.equal(200);
        expect(response.body.name).to.equal(reader.name);
        expect(response.body.email).to.equal(reader.email);
        expect(response.body.password).to.equal(undefined);
      });

      it("returns a 404 if the reader does not exist", async () => {
        const response = await request(app).get("/readers/12345");

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal("The reader could not be found.");
      });
    });

    describe("PATCH /readers/:id", () => {
      it("updates readers email by id", async () => {
        const reader = readers[0];
        const response = await request(app)
          .patch(`/readers/${reader.id}`)
          .send({ email: "miss_e_bennet@gmail.com" });
        const updatedReaderRecord = await Reader.findByPk(reader.id, {
          raw: true,
        });

        expect(response.status).to.equal(200);
        expect(updatedReaderRecord.email).to.equal("miss_e_bennet@gmail.com");
      });

      it("returns a 404 if the reader does not exist", async () => {
        const response = await request(app)
          .patch("/readers/12345")
          .send({ email: "some_new_email@gmail.com" });

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal(
          "reader ID (12345) could not be found."
        );
      });

      it(`doesn't patch if a field isn't valid`, async () => {
        const reader = readers[0];
        const response = await request(app)
          .patch(`/readers/${reader.id}`)
          .send({ email: "miss_e_bennetgmail.com" });

        expect(response.status).to.equal(400);
        expect(response.body).to.equal(`"email" must be a valid email`);
      });
    });

    describe("DELETE /readers/:id", () => {
      it("deletes reader record by id", async () => {
        const reader = readers[0];
        const response = await request(app).delete(`/readers/${reader.id}`);
        const deletedReader = await Reader.findByPk(reader.id, { raw: true });

        expect(response.status).to.equal(204);
        expect(deletedReader).to.equal(null);
      });

      it("returns a 404 if the reader does not exist", async () => {
        const response = await request(app).delete("/readers/12345");
        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal("The reader could not be found.");
      });
    });
  });
});
