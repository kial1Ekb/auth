const conn = require("../utils/dbConnection").promise();

exports.homePage = async (req, res, next) => {
    const userId = req.user.id;

    const [row] = await conn.execute("SELECT * FROM `users` WHERE `id`=?", [userId]);

    if (row.length !== 1) {
        return res.redirect("/logout");
    }

    res.render("home", {
        user: row[0]
    });
};
