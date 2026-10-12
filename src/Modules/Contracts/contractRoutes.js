const ContractControllers = require("./Contract.controller.js")
const {VerifyJWT} = require("../Auth/auth.controller.js")
const ContractRouter = require("express").Router()

ContractRouter.post("/create",VerifyJWT,ContractControllers.create)
ContractRouter.put("/edit",VerifyJWT,ContractControllers.edit)
ContractRouter.delete("/del",VerifyJWT,ContractControllers.del)
ContractRouter.get("/search",VerifyJWT,ContractControllers.search)
ContractRouter.get("/profile",VerifyJWT,ContractControllers.profile)

module.exports = ContractRouter