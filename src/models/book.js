module.exports = (connection, DataTypes) => {
  const schema = {
    title: DataTypes.STRING,
    isbn: {
      type: DataTypes.STRING,
      unique: {
        args: true,
        msg: "isbn must be unique",
      },
    },
  };

  const bookModel = connection.define("Book", schema);
  return bookModel;
};
