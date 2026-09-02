const express = require('express')

const app = express()

// Built-in middleware
app.use(express.json())

const transactionRoutes = require("./routes/transactionRoutes")
const errorMiddleware = require("./middleware/errorMiddleware")

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
app.use(errorMiddleware)

module.exports = app