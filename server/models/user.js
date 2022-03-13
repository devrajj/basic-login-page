const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/userInformation");
const usersSchema = new mongoose.Schema({
  email: String,
  name: String,
  password: String
})
const User = new mongoose.model("User", usersSchema);
module.exports = User;
