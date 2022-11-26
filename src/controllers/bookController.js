const {
  postItem,
  getItems,
  getItemById,
  updateItem,
  deleteItemById,
} = require("./helper");

exports.create = async (req, res) => postItem(res, "book", req.body);
exports.read = async (req, res) => getItems(res, "book");
exports.readId = async (req, res) => getItemById(res, "book", req.params.id);
exports.update = async (req, res) => updateItem(res, "book", req.body, req.params.id);
exports.delete = async (req, res) => deleteItemById(res, "book", req.params.id);