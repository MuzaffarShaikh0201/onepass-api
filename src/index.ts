import Cors from "cors";
import helmet from "helmet";
import bodyParser from "body-parser";
// import session from "express-session";
import express, { Request, Response } from "express";

import authRouter from "./routes/auth";
import { envConfig } from "./core/envConfig";
import coloredLogsMiddleware from "./middlewares/logsMiddleware";

const app = express();
const port = envConfig.PORT || 3001;

app.use(helmet());
app.use(bodyParser.json());
app.use(coloredLogsMiddleware);
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
	Cors({
		origin: "*", // replace with frontend url
		// credentials: true, // enable set cookie if using session based authentication
		methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
	})
);

// uncomment this if you are using session based authentication
// app.use(
//   session({
//     secret: "123456789",
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: true },
//   })
// );

// Default route
app.get("/", (req: Request, res: Response) => {
	res.status(200).json({ message: "Hello World!" });
});

// Healthcheck route
app.get("/healthz", async (req: Request, res: Response) => {
	res.status(200).json({ message: "Hello World!" });
});

// Routers
app.use("/auth", authRouter);

app.listen(port, () => {
	console.log(`Example app listening on port ${port}!`);
});
