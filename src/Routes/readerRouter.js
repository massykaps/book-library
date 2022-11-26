const { Router } = require("express");
const readerController = require("../controllers/readerController");

const readerRouter = new Router();

const {
  validateCreateBody,
  validateUpdateBody,
} = require("../../middleware/validation");

readerRouter.post("/", validateCreateBody, readerController.create);
readerRouter.get("/", readerController.read);
readerRouter.get("/:id", readerController.readId);
readerRouter.patch("/:id", validateUpdateBody, readerController.update);
readerRouter.delete("/:id", readerController.delete);

module.exports = readerRouter;
