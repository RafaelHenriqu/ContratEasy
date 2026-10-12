
// --==-- Requires && Configs --==-- //

require("dotenv").config()
const App = require("./App")
const PORT = process.env.SERVER_PORT || 5000

// --==-- Starting server! --==-- //

const Server = App.listen(PORT, () => {
    console.log("Servidor inicializado!")
})

// --==-- Error checking --==-- //

const errorHandlers = {
    ["EADDRINUSE"]: (err) => {
        return {
            type: 'error',
            message: `❌ Porta ${err.port} já está em uso.`
        }
    },
    ["EACCES"]: (err) => {
        return {
            type: 'error',
            message: `❌ Permissão negada na porta ${PORT}.`
        }
    }
}
Server.on("error", (err) => {
    const Handler = errorHandlers[err.code]
    if (Handler) {
        const Result = Handler(err)
        if (console[Result.type]) { 
            console[Result.type](Result.message)
        }else{
            console.log("Desculpe-nos algo venho a falhar!")
        }
    }
})