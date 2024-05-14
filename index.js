import express from "express";

import dotenv from "dotenv";

import session from "express-session";
import {dirname, join} from "path";
import { fileURLToPath } from 'url';

import { ExpressAuth } from "@auth/express";
import Google from "@auth/express/providers/google";
import Github from "@auth/express/providers/github";

import cookieParser from "cookie-parser";
import routes from "./routes.js";
import { getSession } from "@auth/express";

const authConfig = { providers: [ Google, Github ] };

export async function authSession(req, res, next) {
    res.locals.session = await getSession(req, authConfig);
    next()
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file
dotenv.config();

const app = express();

app.set("views", join(__dirname, "views"));
app.set("view engine", "ejs");

// Enable JSON parsing for request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Cookie Parser
app.use(cookieParser());

// Sessions storage
app.use(authSession);

app.use(session({
    name: "session",
    secret: process.env.APP_SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 3600 * 1000, // 1 Hour
    }
}));

// Mount routes
app.use(express.static(join(__dirname, 'public')));
app.use(routes);

// Mount OAuth2
app.use("/api/auth/*", ExpressAuth(authConfig));

// Centralized error handling
app.use((err, req, res, next) => {
    // Set default error properties if not provided
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    console.error(err);

    // Send a JSON response with the error details
    return res.status(err.statusCode).json({
        status: 1,
        message: err.message,
    });
});

// Start the server
const port = process.env.BACKEND_PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});