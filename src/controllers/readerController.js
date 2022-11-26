const {
  postItem,
  getItems,
  getItemById,
  updateItem,
  deleteItemById,
} = require("./helper");

exports.create = async (req, res) => postItem(res, "reader", req.body);
exports.read = async (req, res) => getItems(res, "reader");
exports.readId = async (req, res) => getItemById(res, "reader", req.params.id);
exports.update = async (req, res) => updateItem(res, "reader", req.body, req.params.id);
exports.delete = async (req, res) => deleteItemById(res, "reader", req.params.id);