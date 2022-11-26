const { faker } = require("@faker-js/faker");

const bookData = (options = {}) => {
  return {
    title: options.title || faker.lorem.words(),
    isbn: options.isbn || faker.lorem.word(10),
  };
};

const readerData = (options = {}) => {
  return {
    name: options.name || faker.name.fullName(),
    email: options.email || faker.internet.email(),
    password: options.password || faker.internet.password(8),
  };
};

const genreData = (options = {}) => {
  return {
    genre: options.genre || faker.lorem.words(),
  };
};

const authorData = (options = {}) => {
  return {
    author: options.name || faker.name.fullName(),
  };
};
module.exports = { bookData, readerData, genreData, authorData };
