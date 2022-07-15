
const mongoose = require("mongoose")

const cryptosSchema = new mongoose.Schema({
  coin: { type: String, required: true },
  abbreviation: { type: String, required: true },
  amount: { type: Number, required: true },
  price: {type: String, default: '0'},
  percentageChange: {type: String, default: '0'}
  }, 
  {timestamps: true}
)

const Crypto = mongoose.model("Crypto", cryptosSchema)

module.exports = Crypto
