const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

passport.use(new GoogleStrategy({
        clientID: <clientID>, // Данные из вашего аккаунта.
        clientSecret: <clientSecret>, // Данные из вашего аккаунта.
        callbackURL: "http://localhost:3000/auth/callback",
        passReqToCallback: true
    }, function (request, accessToken, refreshToken, profile, done) {
        console.log(request);
        console.log(accessToken);
        console.log(refreshToken);
        console.log(profile);
        console.log(done);

        return done(null, profile);
    }
));