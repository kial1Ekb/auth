const jwt = require('jsonwebtoken');
const conn = require('../utils/dbConnection').promise();

exports.getUser = async (req, res, next) => {
    try {
        if (
            !req.headers.authorization ||
            !req.headers.authorization.startsWith('Bearer') ||
            !req.headers.authorization.split(' ')[1]
        ) {
            return res.status(422).json({
                status: 1,
                message: "Please provide the token",
            });
        }

        const theToken = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(theToken, 'the-super-strong-secrect');

        const [row] = await conn.execute(
            "SELECT `id`,`name`,`email` FROM `users` WHERE `id` =? ",
            [decoded.id]
        );

        if (row.length > 0) {
            return res.json({
                user: row[0]
            });
        }

        return res.json({
            status: 1,
            message: "No user found"
        });
    } catch (err) {
        next(err);
    }
}