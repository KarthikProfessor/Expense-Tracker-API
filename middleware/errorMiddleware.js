const errorMiddleware = (error, req, res, next) => {
  console.error(error)

  if (error.name === "ValidationError") {
    return res.status(400).json({
      message: "Validation failed",
      errors: Object.values(error.errors).map(
        (item) => item.message
      )
    })
  }

  if (error.name === "CastError") {
    return res.status(400).json({
      message: "Invalid resources ID"
    })
  }

  res.status(500).json({
    message: "Internal server error",
    error: error.message
  })
}

module.exports = errorMiddleware