import { Router } from "express";

const router = Router();

import {body} from "express-validator";
import {loginPage, login} from "./controllers/loginController.cjs";
import {registerPage, register} from "./controllers/registerController.cjs";
import pkg from 'jsonwebtoken';
import {homePage} from "./controllers/homeController.cjs";
const {verify} = pkg;

const validateToken = (req, res, next) => {
    // Check for OAuth2
    const { session } = res.locals;
    console.log({ user: session?.user });

    if (session) {
        next();
    }

    // Check if logged with our auth
    const token = req.header("Authorization") || req.cookies.token;

    if (!token) {
        return res.redirect("/login");
    }

    try {
        req.user = verify(token, process.env.APP_JWT_TOKEN_SECRET);

        next();
    } catch (err) {
        return res.status(401).json({error: "Invalid token"});
    }
};

const checkIfLoggedIn = (req, res, next) => {
    const token = req.header("Authorization") || req.token;

    if (!token) {
        next();
    }
}

// Home
router.get("/", validateToken, homePage);

// Login
router.get("/login", checkIfLoggedIn, loginPage);
router.post("/login",
    [
        body("email", "Invalid email address")
            .notEmpty()
            .escape()
            .trim()
            .isEmail(),
        body("password", "The Password must be of minimum 4 characters length")
            .notEmpty()
            .trim()
            .isLength({min: 4})
    ],
    login
);

// Signup (old Register)
router.get("/signup", checkIfLoggedIn, registerPage);
router.post("/signup",
    [
        body("name", "The name must be of minimum 3 characters length")
            .notEmpty()
            .escape()
            .trim()
            .isLength({min: 3}),
        body("email", "Invalid email address")
            .notEmpty()
            .escape()
            .trim()
            .isEmail(),
        body("password", "The Password must be of minimum 4 characters length")
            .notEmpty()
            .trim()
            .isLength({min: 4})
    ],
    register
);

// Logging out
router.get("/logout", (req, res, next) => {
    req.session.destroy((err) => {
        next(err);
    });

    res.clearCookie("token");

    res.redirect("/login");
});

export default router;
