module.exports = (connection, DataTypes) => {
  const schema = {
    genre: {
      type: DataTypes.STRING,
      unique: {
        args: true,
        msg: "Genre already exists",
      },
    },
  };

  const genreModel = connection.define("Genre", schema);

  return genreModel;
};
