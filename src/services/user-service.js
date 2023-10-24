const { User } = require("../models");

exports.createUser = (user) => User.create(user);

exports.getUserById = (id) => User.findByPk(id);

exports.getUserByEmail = async (email) => {
  const user = await User.findOne({
    where: { email: email },
  });

  return user;
};
