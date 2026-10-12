const express = require("express")
const AuthRoutes = require("./Modules/Auth/Auth.routes")
const ContractRoutes = require("./Modules/Contracts/ContractRoutes")
const App = express()

App.use(require("cookie-parser")())
App.use(express.urlencoded({ extended: true }))
App.use(express.json())
App.use("/auth",AuthRoutes)
App.use("/contract",ContractRoutes)

module.exports = App