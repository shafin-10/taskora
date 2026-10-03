import express from "express"
import cors from "cors";
import healthCheckRouter from "./routes/healthCheck.routes.js";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";


const app = express();
app.use(cookieParser())

//basic configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"))
app.use(cors({
    origin : process.env.CORS_ORIGIN?.split(",") || "http://localhost:5173",
    credentials : true,
    methods : ["GET", "POST", "PUT", "OPTIONS", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));


app.use("/api/v1/healthcheck", healthCheckRouter);

app.use("/api/v1/auth", authRouter);

app.get('/', (req, res) => {
    res.send('welcome to my web app');
})




export default app;