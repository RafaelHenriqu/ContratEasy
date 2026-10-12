const {Router} = require("express")
const Controller = require("../Auth/auth.controller")
const {registerValidation} = require("../../validations/userValidations") // Disabled
const AuthRoutes = Router()

AuthRoutes.post("/register",Controller.Register)
AuthRoutes.post("/login",Controller.login)

module.exports = AuthRoutes