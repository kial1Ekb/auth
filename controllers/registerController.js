const {validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const conn = require('../utils/dbConnection').promise();

exports.register = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }

    try {
        const [row] = await conn.execute(
            "SELECT `email` FROM `users` WHERE `email`=?",
            [req.body.email]
        );

        if (row.length > 0) {
            return res.status(201).json({
                status: 1,
                message: "The E-mail already in use",
            });
        }

        const hashPass = await bcrypt.hash(req.body.password, 12);

        const [rows] = await conn.execute('INSERT INTO `users` (`name`, `email`, `password`) VALUES(?, ?, ?)', [
            req.body.name,
            req.body.email,
            hashPass
        ]);

        if (rows.affectedRows !== 1) {
            return res.status(500).json({
                status: 1,
                message: "Something went wrong",
            });
        }

        return res.status(201).json({
            status: 0, // 0 for success, 1 for error
            message: "The user has been successfully inserted",
        });
    } catch (err) {
        next(err);
    }
}

exports.registerPage = (req, res, next) => {
    res.render("register");
};
