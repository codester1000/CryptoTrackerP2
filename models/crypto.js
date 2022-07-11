
const mongoose = require("mongoose")

const cryptosSchema = new mongoose.Schema({
  coin: { type: String, required: true },
  abbreviation: { type: String, required: true },
  amount: { type: Number, required: true },
  }, 
  {timestamps: true}
)

const Crypto = mongoose.model("Crypto", cryptosSchema)

module.exports = Crypto
