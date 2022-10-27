import express from "express"
import deserializeUser from "../middleware/deserializeuser"
import routes from "../routes"

const mongoSanitize = require("express-mongo-sanitize")
var RateLimit = require("express-rate-limit")

function createServer(){
    const app = express()
    const limiter = RateLimit({
        windowMs: 1*60*1000,
        max: 10
    })

    app.use(limiter)

    app.use(express.json())

    app.use(deserializeUser)

    app.use(mongoSanitize())

    app.use(
        mongoSanitize({
          replaceWith: '_',
        }),
    );

    routes(app)

    return app
}

export default createServer