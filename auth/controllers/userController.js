const userModel = require("../models/userModel").userModel;
const database = require("../models/userModel").database


const getUserByEmailIdAndPassword = (email, password) => {
  let user = userModel.findOne(email);
  if (user) {
    if (isUserValid(user, password)) {
      return user;
    }
  }
  return null;
};
const getUserById = (id) => {
  let user = userModel.findById(id);
  if (user) {
    return user;
  }
  return null;
};

function isUserValid(user, password) {
  return user.password === password;
}

const getGitHubIdAndPassword = (profile) => {
  console.log(profile)
  const user = database.find((data) => data.id === profile.id);
  if (user) {
    return user;
  }
  userModel.createuser(profile)
  getGitHubIdAndPassword(profile)
}

module.exports = {
  getUserByEmailIdAndPassword,
  getUserById,
  getGitHubIdAndPassword,
};
