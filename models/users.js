
const mongoose = require("mongoose")

const usersSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  image: String,
  name: String,
  coins: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Crypto"
  }]
})

const User = mongoose.model("User", usersSchema)

module.exports = User
