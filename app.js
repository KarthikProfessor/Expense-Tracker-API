const express = require('express')

const app = express()

// Built-in middleware
app.use(express.json())

const transactionRoutes = require("./routes/transactionRoutes")

app.get("/", (req, res) => {
  res.json({
    message: "Expense Tracker Api is Working"
  })
})

// app.get("/test", (req, res) => {
//   res.json({
//     message: "TEST Route Works"
//   })
// })

app.use("/api/transactions", transactionRoutes)

module.exports = app