const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const initialize = (getUserByEmail, getUserById) => {
    const authenticateUser = async (email, password, done) => {
        try {
            const user = await getUserByEmail(email);
            if (!user)
                return done(null, false, {
                    message: 'Email or password is wrong'
                });

            if (await bcrypt.compare(password, user.password))
                return done(null, user);
            else
                return done(null, false, {
                    message: 'Email or password is wrong'
                });
        } catch (err) {
            return done(err);
        }
    };

    passport.use(
        new LocalStrategy(
            {
                usernameField: 'email',
                passwordField: 'password',
            },
            authenticateUser
        )
    );

    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser(async (id, done) => {
        return done(null, await getUserById(id));
    });
};

module.exports = initialize;