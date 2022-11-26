const {
  postItem,
  getItems,
  getItemById,
  updateItem,
  deleteItemById,
} = require("./helper");

exports.create = async (req, res) => postItem(res, "genre", req.body);
exports.read = async (req, res) => getItems(res, "genre");
exports.readId = async (req, res) => getItemById(res, "genre", req.params.id);
exports.update = async (req, res) => updateItem(res, "genre", req.body, req.params.id);
exports.delete = async (req, res) => deleteItemById(res, "genre", req.params.id);