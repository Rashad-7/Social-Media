import * as  dotenv from "dotenv"
import path from "path"
dotenv.config({path:path.resolve("./src/config/.env.dev"),debug:false})
import  bootstrap  from './src/app.controller.js'
import  express  from 'express'
import chalk from "chalk"
import { authentication } from "./src/middleware/Socket/auth.middleware.js"
import { socketConnection } from "./src/DB/model/User.model.js"
import { runIo } from "./src/modules/Socket/socket.controller.js"
const app = express()
const port = process.env.PORT
bootstrap(app , express) 
const httpServer= app.listen(port, () => console.log(chalk.bgGreen(`Example app listening on port ${port} 👉👈`)))
runIo(httpServer)