const { Book, Reader, Genre, Author } = require("../models");

const getModel = (model) => {
  const models = {
    book: Book,
    reader: Reader,
    genre: Genre,
    author: Author,
  };

  return models[model];
};

const getOptions = (model) => {
  if (model === "book") return { include: [Genre, Author] };
  if (model === "genre" || model === "author") return { include: Book };

  return {};
};

const postItem = async (res, model, data) => {
  const Model = getModel(model);

  try {
    const dbItem = await Model.create(data);
    return res.status(201).json(dbItem);
  } catch (err) {
    return res.status(404).json({ error: `${model} not created` });
  }
};

const getItems = async (res, model) => {
  const Model = getModel(model);

  const options = getOptions(model);

  const dbItem = await Model.findAll({
    ...options,
    attributes: {
      exclude: ["password"],
    },
  });
  if (!dbItem) {
    return res.status(404).json({ error: `${model} not found` });
  }
  return res.status(200).json(dbItem);
};

const getItemById = async (res, model, id) => {
  const Model = getModel(model);

  const options = getOptions(model);

  const itemId = id;
  const dbItem = await Model.findByPk(itemId, {
    ...options,
    attributes: {
      exclude: ["password"],
    },
  });

  if (!dbItem) {
    return res.status(404).json({ error: `The ${model} could not be found.` });
  }
  return res.status(200).json(dbItem);
};

const updateItem = async (res, model, body, id) => {
  const Model = getModel(model);

  const itemId = id;
  const updateData = body;
  let updatedRows;
  try {
    [updatedRows] = await Model.update(updateData, {
      where: { id: itemId },
    });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ error: `isbn must be unique` });
    }
  }
  if (!updatedRows) {
    return res
      .status(404)
      .json({ error: `${model} ID (${itemId}) could not be found.` });
  }
  return res.status(200).json({ result: `${model} Updated` });
};

const deleteItemById = async (res, model, id) => {
  const Model = getModel(model);
  const itemId = id;

  try {
    const deletedRows = await Model.destroy({ where: { id: itemId } });

    if (!deletedRows) {
      return res
        .status(404)
        .json({ error: `The ${model} could not be found.` });
    }
    return res.status(204).json({ result: `${model} Deleted` });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  postItem,
  getItems,
  getItemById,
  updateItem,
  deleteItemById,
};
