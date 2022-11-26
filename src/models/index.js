const Sequelize = require("sequelize");
const readerModel = require("./reader");
const bookModel = require("./book");
const genreModel = require("./genre");
const authorModel = require("./author");

const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT } = process.env;

const setupDatabase = () => {
  const connection = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: "mysql",
    logging: false,
  });

  const Reader = readerModel(connection, Sequelize);
  const Book = bookModel(connection, Sequelize);
  const Genre = genreModel(connection, Sequelize);
  const Author = authorModel(connection, Sequelize);

  Reader.hasMany(Book);
  Genre.hasMany(Book);
  Author.hasMany(Book);
  Book.belongsTo(Genre);
  Book.belongsTo(Author);

  connection.sync({ alter: true });
  return {
    Reader,
    Book,
    Genre,
    Author,
  };
};

module.exports = setupDatabase();
