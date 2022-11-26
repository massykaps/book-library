module.exports = (connection, DataTypes) => {
  const schema = {
    author: {
      type: DataTypes.STRING,
      unique: {
        args: true,
        msg: "Author already exists",
      },
    },
  };

  const authorModel = connection.define("Author", schema);

  return authorModel;
};
