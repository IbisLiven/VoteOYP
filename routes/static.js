const express = require('express')
const route = express.Router()

const path = require('path')

route.use(express.static(path.resolve('static')))

module.exports = route
