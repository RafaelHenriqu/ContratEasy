const { hash, compare } = require("bcrypt")
const Mustache = require("mustache")
const JWT = require("jsonwebtoken")
const express = require("express")
const App = express()
require("dotenv").config()

const MySQL = require("mysql2").createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    port: process.env.port,
    database: process.env.database
})

// Express Config | App.Use //

App.use(express.static(`${__dirname}/public`))
App.use(require("cookie-parser")())
App.use(express.urlencoded({ extended: true }))
App.use(express.json())

// Functiosn | Verfity //

function Verify_User(req, res, next) {
    const Token = req.cookies.Token

    if (!Token) {
        return res.status(500).json({
            Message: "Desculpe porem algo falhou!",
            Status: 500,
            Redirect: "/Login"
        })
    }

    try {

        const Verify_JWT = JWT.verify(Token, process.env.SC)
        next()
    } catch (err) {
        res.clearCookie("Token")
        return res.status(500).json({
            Message: "Desculpe porem algo falhou!",
            Status: 500,
            Redirect: "/Login"
        })
    }
}

function Verify_Admin(req,res,next){

        const Token = req.cookies.Token

    if (!Token) {
        return res.status(500).json({
            Message: "Desculpe porem algo falhou!",
            Status: 500,
            Redirect: "/Login"
        })
    }

    try {

        const Verify_JWT = JWT.verify(Token, process.env.SC)
         MySQL.query("SELECT * FROM users where UserName = ?",[Verify_JWT.UserName],(err,results,fields)=>{
       
        if (results[0].Roles == "Admin"){
            console.log("Desenvolvedor Indentificado")
            next()
        
        }else{
        return res.status(200).json({
            Message: "Desculpe porem Você não tem acceso a tal pagina",
            Status: 500,
            Redirect: "/Login"
        })}

    })
    } catch (err) {
        res.clearCookie("Token")
        return res.status(500).json({
            Message: "Desculpe porem algo falhou!",
            Status: 500,
            Redirect: "/Login"
        })
    }



  
    
}



// Rotas | Post //

App.post("/Register", async (req, res) => {
    let { UserName, Password, Gmail } = req.body
    Password = await hash(Password, Math.floor(Math.random() * 25 + 10))

    console.log(`\n Usuario: ${UserName} \n Senha: ${Password} \n Gmail: ${Gmail}`)
    MySQL.query("SELECT * FROM users where UserName = ? or Gmail = ?", [UserName, Gmail], (err, result, fields) => {
        if (err) {
            return res.status(400).json({
                Error: "Desculpe Porem algo em nosso servidor venho a falhar.",
                Redirect: false
            })

        }

        if (result.length > 0) {
            return res.status(400).json({
                Error: "Desculpe-nos mas esse nome ou Email ja está sendo utilizado por outro usuario.",
                Redirect: false
            })
        }



        MySQL.query("INSERT INTO users (UserName,User_Password,Gmail,Roles) values (?,?,?,?)", [UserName, Password, Gmail, 'Default'], (err, result, fields) => {

            if (err) {
                return res.status(400).json({
                    Error: "Desculpe Porem algo em nosso servidor venho a falhar.",
                    Redirect: false
                })

            }
            return res.status(200).json({
                Error: "Conta Criada com Exito!",
                Redirect: "/Login"
            })
        })


    })


})

App.post("/Login", async (req, res) => {
    let { UserName, Password } = req.body
    MySQL.query("select * from users where UserName = ?", [UserName], async (err, result, fields) => {

        if (err) {
            return res.status(400).json({
                Error: "Desculpe Porem algo em nosso servidor venho a falhar.",
                Redirect: false
            })

        }

        if (result.length > 0) {
            const Verify_Password = await compare(Password, result[0].User_Password)

            if (Verify_Password) {
                const Token = JWT.sign({ UserName }, process.env.SC, { expiresIn: "7d" })
                res.cookie("Token", Token)
                res.redirect("/")
            } else {
                return res.status(401).json({
                    Error: "Senha incorreta!",
                    Redirect: false
                })
            }

        }

    })
})

App.post("/Admin/Models/Add",Verify_Admin,(req,res)=>{
    const {Title,Description,Content} = req.body

    MySQL.query("INSERT INTO contract (Title_Contract,Content,Description_Contract) values (?,?,?)",[Title,Content,Description],(err,results,fields)=>{
        if (err) {
            return res.status(400).json({
                Error: "Desculpe Porem algo em nosso servidor venho a falhar.",
                Redirect: false
            })
        }else{
                       return res.status(200).json({
                Error: "Contrato Criada com Exito!",
                Redirect: "/"
            })
        }
        


    })
    
})

App.post("/Contract_Edit/:id", Verify_User, (req, res) => {

    MySQL.query("SELECT * FROM contract where Contract_Id = ?",[req.params.id],(err,results,fields)=>{
         if (err) {
            return res.status(400).json({
                Error: "Desculpe Porem algo em nosso servidor venho a falhar.",
                Redirect: false
            })
        }else{
            res.json(Mustache.render(results[0].Content,req.body))
        }
        
    })

})


// Rotas | Get //

App.get("/", Verify_User, (req, res) => {
    
    MySQL.query("SELECT * FROM contract",(err,results,fields)=>{
         if (err) {
            return res.status(400).json({
                Error: "Desculpe Porem algo em nosso servidor venho a falhar.",
                Redirect: false
            })
        }else{
            res.json(results)
        }
        
    })

})

App.get("/Contract/:id", Verify_User, (req, res) => {

    MySQL.query("SELECT * FROM contract where Contract_Id = ?",[req.params.id],(err,results,fields)=>{
         if (err) {
            return res.status(400).json({
                Error: "Desculpe Porem algo em nosso servidor venho a falhar.",
                Redirect: false
            })
        }else{
            res.json(results)
        }
        
    })

})



App.listen(5000, () => {
    console.log("Starting!")
})
