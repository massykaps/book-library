const {
  postItem,
  getItems,
  getItemById,
  updateItem,
  deleteItemById,
} = require("./helper");

exports.create = async (req, res) => postItem(res, "author", req.body);
exports.read = async (req, res) => getItems(res, "author");
exports.readId = async (req, res) => getItemById(res, "author", req.params.id);
exports.update = async (req, res) => updateItem(res, "author", req.body, req.params.id);
exports.delete = async (req, res) => deleteItemById(res, "author", req.params.id);