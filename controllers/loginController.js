const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const conn = require("../utils/dbConnection").promise();

exports.login = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
    }

    try {
        const [row] = await conn.execute(
            "SELECT * FROM `users` WHERE `email`=?",
            [req.body.email]
        );

        if (row.length === 0) {
            return res.status(422).json({
                status: 1,
                message: "Invalid email address",
            });
        }

        const passMatch = await bcrypt.compare(req.body.password, row[0].password);

        if (!passMatch) {
            return res.status(422).json({
                status: 1,
                message: "Incorrect password",
            });
        }

        const theToken = jwt.sign(
            {id: row[0].id},
            process.env.APP_JWT_TOKEN_SECRET,
            {expiresIn: "1h", algorithm: "HS256"}
        );

        return res.json({
            status: 0,
            token: theToken
        });
    } catch (err) {
        next(err);
    }
}

exports.loginPage = (req, res, next) => {
    res.render("login");
};
