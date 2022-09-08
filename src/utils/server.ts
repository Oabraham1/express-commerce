import express from "express"
import deserializeUser from "../middleware/deserializeuser"
import routes from "../routes"
import { rateLimit } from "express-rate-limit"

function createServer(){
    const app = express()
    const limiter = rateLimit({
        windowMs: 1*60*1000,
        max: 10
    })

    app.use(limiter)

    app.use(express.json())

    app.use(deserializeUser)

    routes(app)

    return app
}

export default createServer