
const mongoose = require("mongoose")
const Mschema = mongoose.Schema

const usersSchema = new Mschema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  image: String,
  name: String,
  coins: [{
    type: Mschema.Types.ObjectId,
    ref: 'Crypto'
  }]
})

const User = mongoose.model("User", usersSchema)

module.exports = User
