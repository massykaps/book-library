const Joi = require("joi");

const validateCreateBody = async (req, res, next) => {
  const route = req.baseUrl;
  let createSchema;

  if (route === "/authors") {
    createSchema = Joi.object({
      author: Joi.string().min(2).required(),
    });
  }
  if (route === "/genres") {
    createSchema = Joi.object({
      genre: Joi.string().min(2).required(),
    });
  }
  if (route === "/readers") {
    createSchema = Joi.object({
      name: Joi.string().min(1).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required(),
    });
  }
  if (route === "/books") {
    createSchema = Joi.object({
      title: Joi.string().min(2).required(),
      AuthorId: Joi.number().min(1),
      GenreId: Joi.number().min(1),
      isbn: Joi.string().min(10).required(),
    });
  }

  const { error } = createSchema.validate(req.body);
  if (error) {
    return res.status(400).json(error.message);
  }
  next();
};

const validateUpdateBody = async (req, res, next) => {
  const route = req.baseUrl;
  console.log(route);
  let updateSchema;

  if (route === "/authors") {
    updateSchema = Joi.object({
      author: Joi.string().when({
        is: Joi.exist(),
        then: Joi.string().min(2),
      }),
    });
  } else if (route === "/genres") {
    updateSchema = Joi.object({
      genre: Joi.string().when({
        is: Joi.exist(),
        then: Joi.string().min(2),
      }),
    });
  } else if (route === "/readers") {
    updateSchema = Joi.object({
      name: Joi.string().when({
        is: Joi.exist(),
        then: Joi.string().min(1),
      }),
      email: Joi.string().when({
        is: Joi.exist(),
        then: Joi.string().email(),
      }),
      password: Joi.string().when({
        is: Joi.exist(),
        then: Joi.string().min(8),
      }),
    });
  } else if (route === "/books") {
    updateSchema = Joi.object({
      title: Joi.string().when({
        is: Joi.exist(),
        then: Joi.string().min(2),
      }),
      AuthorId: Joi.number().when({
        is: Joi.exist(),
        then: Joi.number().min(1),
      }),
      GenreId: Joi.number().when({
        is: Joi.exist(),
        then: Joi.number().min(1),
      }),
      isbn: Joi.string().when({
        is: Joi.exist(),
        then: Joi.string(),
      }),
    });
  }
  const { error } = updateSchema.validate(req.body);
  if (error) {
    return res.status(400).json(error.message);
  }
  next();
};

module.exports = { validateCreateBody, validateUpdateBody };
