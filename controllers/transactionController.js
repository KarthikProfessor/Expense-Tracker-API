const Transaction = require("../models/Transaction")

const createTransaction = async(req, res) => {
  try {

    const {
      title,
      amount,
      type,
      category,
      date,
      description
    } = req.body

    const transaction = await Transaction.create({
      title,
      amount,
      type,
      category,
      date,
      description
    })

    res.status(201).json(transaction)

  } catch (error) {

    res.status(500).json({
      message: "Failed to create transaction",
      error: error.message
    })
  }
}

const getTransactions = async(req, res) => {
  try {

    const { 
      type, 
      category, 
      sort,
      startDate,
      endDate,
      page = 1,
      limit = 5 
    } = req.query

    const pageNumber = Number(page)
    const limitNumber = Number(limit)
    const filter = {}

    // Validation
    if (type && !["income", "expense"].includes(type)) {
      return res.status(400).json({
        message: "Type must be either income or expense"
      })
    }

    if (type) {
      filter.type = type
    }

    if (category) {
      filter.category = category
    }

    if (startDate && isNaN(new Date(startDate).getTime())) {
      return res.status(400).json({
        message: "Invalid startDate"
      })
    }

    if (endDate && isNaN(new Date(endDate).getTime())) {
      return res.status(400).json({
        message: "Invalid endDate"
      })
    }

    if (startDate || endDate) {
      filter.date = {}

      if (startDate) {
        filter.date.$gte = new Date(startDate)
      }

      if (endDate) {
        filter.date.$lte = new Date(endDate)
      }
    }

    const skip = (pageNumber - 1) * limitNumber

    let query = Transaction.find(filter)
    
    if (sort) {
      query = query.sort(sort)
    }

    //
    query = query.skip(skip)
    query = query.limit(limitNumber)

    const transaction = await query;

    const totalTransactions = await Transaction.countDocuments(filter)

    const totalPages = Math.ceil(totalTransactions / limitNumber)

    const hasNextPage = pageNumber < totalPages

    const hasPreviousPage = pageNumber > 1

    res.status(201).json({
      data: transaction,

      pagination: {
        currPage: pageNumber,
        limit: limitNumber,
        totalTransactions,
        totalPages,
        hasNextPage,
        hasPreviousPage
      }
    })

  } catch (error) {
    res.status(500).json({
      message: "Failed to get transactions",
      error: error.message
    })
  }
}

const getTransactionSummary = async(req, res) => {
  try {

    const summary = await Transaction.aggregate([
      {
        $group: {
          _id: null,

          totalIncome: {
            $sum: {
              $cond: [
                { $eq: ["$type", "income"] },
                "$amount",
                0
              ]
            }
          },

          totalExpense: {
            $sum: {
              $cond: [
                { $eq: ["$type", "expense"] },
                "$amount",
                0
              ]
            }
          },
        }
      }
    ])

    const result = summary[0] || {
      totalIncome: 0,
      totalExpense: 0
    }

    const balance = result.totalIncome - result.totalExpense

    res.status(200).json({
      totalIncome: result.totalIncome,
      totalExpense: result.totalExpense,
      balance
    })

  } catch (error) {

    res.status(500).json({
      message: "Failed to get transaction summary",
      error: error.message
    })

  }
}

const categorySummary = async(req, res) => {
  try {

    const summary = await Transaction.aggregate([
      {
        $match: {
          type: "expense"
        }
      },
      {
        $group: {
          _id: "$category",

          total: {
            $sum: "$amount"
          }
        }
      },

      {
        $project: {
          _id: 0,
          category: "$_id",
          total: 1
        }
      },

      {
        $sort: {
          total: 1
        }
      }
    ])

    res.status(200).json(summary)

  } catch (error) {
    res.status(500).json({
      message: "Failed to get category summary",
      error: error.message
    })
  }
}

const monthlySummary = async(req, res) => {
  try {

    const summary = await Transaction.aggregate([
      {
        $group: {
          _id: {
            year: {
              $year: "$date"
            },
            month: {
              $month: "$date"
            }
          },
          income: {
            $sum: {
              $cond: [
                { $eq: ["$type", "income"] },
                "$amount",
                0
              ]
            }
          },
          expense: {
            $sum: {
              $cond: [
                { $eq: ["$type", "expense"] },
                "$amount",
                0
              ]
            }
          }
        }
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1
        }
      },
      {
        $replaceWith: {
          year: "$_id.year",
          month: "$_id.month",
          income: "$income",
          expense: "$expense",
          balance: {
            $subtract: [
              "$income",
              "$expense"
            ]
          }
        }
      }
    ])

    res.status(200).json(summary)

  } catch (error) {
    res.status(500).json({
      message: "Failed to get monthly summary",
      error: error.message
    })
  }
}

module.exports = {
  createTransaction,
  getTransactions,
  getTransactionSummary,
  categorySummary,
  monthlySummary
}