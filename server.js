require('dotenv').config()
const dns = require('dns')
dns.setServers(["1.1.1.1", "8.8.8.8"])
const app = require("./app.js")

const mongoose = require('mongoose')

const port = process.env.PORT
app.listen(port, () => {
  console.log(`server running at http://localhost:${port}`)
})

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected')
  })
  .catch(err => console.log(err))