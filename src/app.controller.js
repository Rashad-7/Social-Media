import path from "node:path";
import connectDB from './DB/connection.js'
import authController from './modules/auth/auth.controller.js'
import userController from './modules/user/user.controller.js'
import postController from './modules/post/post.controller.js'
import chatController from './modules/chat/chat.controller.js'
import { globalErrorHandling } from './utils/res/error.response.js'
import cors from "cors"
import rateLimit from "express-rate-limit";
import playground  from "graphql-playground-middleware-express"
import helmet from "helmet";
import { createHandler } from "graphql-http/lib/use/express";
import morgan from "morgan";
import { schema } from "./modules/app.garph.js";
const limiter=rateLimit({
    limit:5,
    windowMs:2*60*1000
})
const postLimiter=rateLimit({
    limit:2,
    windowMs:2*60*1000,
    message:{error:"Rate limit Reached"},
    
})
const bootstrap = (app, express) => {
    app.use(morgan("dev"))
    app.use(cors())
    app.use('/auth',limiter)
    app.use('/post',postLimiter)
    app.use(helmet())
    app.use('/uploads',express.static(path.resolve("./src/uploads")))
    app.use(express.json()) 
    app.get("/", (req, res, next) => {
        return res.status(200).json({ message: "Welcome in node.js project powered by express and ES6" })
    })


app.use("/graphql",createHandler({schema:schema}))
app.get("/playground", playground.default({ endpoint: "/graphql" }))
    app.use("/auth", authController)
    app.use("/user", userController)
    app.use("/post", postController)
    app.use("/chat", chatController)

    app.all("*", (req, res, next) => {
        return res.status(404).json({ message: "In-valid routing" })
    })
    app.use(globalErrorHandling)
}
connectDB()
export default bootstrap