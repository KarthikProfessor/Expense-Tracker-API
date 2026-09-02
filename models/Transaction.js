const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minLen: 3,
    maxLen: 100
  },

  amount: {
    type: Number,
    required: true,
    min: 0
  },

  type: {
    type: String,
    required: true,
    enum: ["income", "expense"]
  },

  category: {
    type: String,
    required: true,
    trim: true
  },

  date: {
    type: Date,
    required: true,
    default: Date.now()
  },

  description: {
    type: String,
    default: "",
    trim: true,
    maxLen: 500
  }
}, { timestamps: true })

const transaction = mongoose.model("transaction", transactionSchema)

module.exports = transaction