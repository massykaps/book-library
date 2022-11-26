const { Router } = require("express");
const bookController = require("../controllers/bookController");

const bookRouter = new Router();

const {
  validateCreateBody,
  validateUpdateBody,
} = require("../../middleware/validation");

bookRouter.post("/", validateCreateBody, bookController.create);
bookRouter.get("/", bookController.read);
bookRouter.get("/:id", bookController.readId);
bookRouter.patch("/:id", validateUpdateBody, bookController.update);
bookRouter.delete("/:id", bookController.delete);

module.exports = bookRouter;
