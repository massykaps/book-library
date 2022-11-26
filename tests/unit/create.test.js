const sinon = require("sinon");

const { create } = require("../../src/controllers/bookController");
const { Book } = require("../../src/models");

describe("create", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        title: "The Lord of the Rings",
        isbn: "978-0261103252",
      },
    };

    res = {
      status: () => {
        () => {};
      },
    };
  });

  afterEach(() => {
    sinon.restore();
  });

  it("is called once with the request body", () => {
    const createdSpy = sinon.spy(Book, "create");

    create(req, res);

    sinon.assert.calledOnce(createdSpy);
    sinon.assert.calledWith(createdSpy, req.body);
  });

  it("resolves", () => {
    const createdStub = sinon.stub(Book, "create").callsFake(() => create);

    create(req, res);

    sinon.assert.calledWith(createdStub, req.body);
    sinon.assert.calledWith(
      createdStub,
      sinon.match({ title: "The Lord of the Rings" })
    );
  });
});
