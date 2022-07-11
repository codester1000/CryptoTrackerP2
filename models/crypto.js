
const mongoose = require("mongoose")

const cryptosSchema = new mongoose.Schema({
  name: { type: String, required: true },
  abbreviation: { type: Number, required: true },
  amount: { type: String, required: true },
  }, 
  {timestamps: true}
)

const Crypto = mongoose.model("Crypto", cryptosSchema)

module.exports = Crypto
