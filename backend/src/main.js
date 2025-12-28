import { publicRouter } from "./routes/public-api.route.js"
import { errorMiddleware } from "./middleware/error.middleware.js"
import { userApiRouter } from "./routes/api.route.js"
import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from 'dotenv'
dotenv.config()

const app = express()
app.use(cors({origin: process.env.FRONTEND_URL, credentials: true}))
app.use(cookieParser())
app.use(express.json())
app.use(publicRouter)
app.use(userApiRouter)
app.use(errorMiddleware)

const port = process.env.PORT || 3000

if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`)
    })
}

export default app
