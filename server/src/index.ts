import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { errorHandler } from "./middleware/error.middleware";
import { notFoundHandler } from "./middleware/not-found.middleware";
import { checkAuth } from "./middleware/auth";
import { cacheRouter } from "./cache/action.router";
import { userRouter } from "./user/user.router";
import * as bodyParser from "body-parser";
import { WebSocketServer } from 'ws';
import { ServerTask } from "./utils/server";
import { config } from './config/config';
import * as http from "http";


// dotenv.config();

/**
 * App Variables
 */

const adminPort: number =  config.adminPort ? config.adminPort : 10;

const app = express();

/**
 *  App Configuration
 */

app.use(helmet());
app.use(bodyParser.json({limit: '100mb'}));
app.use(cors());

//app.use(express.json());

app.use(express.static('public'));

app.use("/api/cache", cacheRouter);
app.use("/api/user", userRouter);

app.use(errorHandler);
app.use(notFoundHandler);

http.createServer(app).listen(adminPort, () => {
    console.log(`admin site port: ${adminPort}`);
});

