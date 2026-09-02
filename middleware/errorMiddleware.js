const errorMiddleware = (error, req, res, next) => {
  console.error(error)

  res.status(500).json({
    message: "Internal server error",
    error: error.message
  })
}

module.exports = errorMiddleware