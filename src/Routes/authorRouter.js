const { Router } = require("express");
const authorController = require("../controllers/authorController");

const authorRouter = new Router();

const {
  validateCreateBody,
  validateUpdateBody,
} = require("../../middleware/validation");

authorRouter.post("/", validateCreateBody, authorController.create);
authorRouter.get("/", authorController.read);
authorRouter.get("/:id", authorController.readId);
authorRouter.patch("/:id", validateUpdateBody, authorController.update);
authorRouter.delete("/:id", authorController.delete);

module.exports = authorRouter;
