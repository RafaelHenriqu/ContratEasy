
// --==-- Requires && Configs --==-- //

require("dotenv").config()
const bcrypt = require("bcrypt")
const JWT = require("jsonwebtoken")
const Connection = require("../../database/connection")

// --==-- JWT --==-- //

const ApplysJWT = (data, req, res, next) => {
    res.cookie("Token", JWT.sign(data, process.env.SECRETS_JWT), {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
    })
}

const VerifyJWT = (req, res, next) => {
    try {
        const Token = req.cookies.Token
        const SECRET = process.env.SECRETS_JWT
        if (!Token) { return res.status(401).json({ error: "Não autenticado" }) }
        const Data = JWT.verify(Token, SECRET, { algorithms: ['HS256'] })
        if (!Data) { return res.status(401).json({ error: "Token inválido" }); }
        req.userId = Data.UserId
        next()
    } catch {
        return null
    }
}

// --==-- Register --==-- //

async function Register(req, res, next) {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
        return res.status(400).json({ message: "Faltam dados: {name, email, password}" });
    }
    const [results] = await Connection.query("SELECT * FROM users where email = ?", [email])
    if (results.length > 0) {
        return res.status(422).json({ message: "Desculpe-nos mas esse Email ja está sendo utilizado." })
    } else {
        const NewPass = await bcrypt.hash(password, 5)
        await Connection.query("INSERT INTO users (name,email,password) values (?,?,?)", [name, email, NewPass])
        return res.status(200).json({ message: "Conta criada!" })
    }
}

// --==-- login --==-- //

async function login(req, res, next) {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).json({ message: "Faltam dados: {email, password}" });
    }
    const [results] = await Connection.query("SELECT * FROM users where email = ?", [email])

    if (results.length > 0) {
        if (await bcrypt.compare(password, results[0].password)) {
            ApplysJWT({ UserId: results[0].id }, req, res, next)
            return res.status(200).json({ message: "Conta Acessada!" })
        } else {
            return res.status(422).json({ message: "Senha Incorreta!" })
        }
    } else {
        return res.status(422).json({ message: "Conta Inexistente!" })
    }
}



module.exports = { Register, login, VerifyJWT }