const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth2').Strategy
const User = require('../model/userModel')

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/google/callback"
},
    async (token, tokenSecret, profile, done) => {
        try {

            if (!profile.emails || !profile.emails.length) {
                throw new Error('No email found in profile');
            }
            const email = profile.emails[0].value;
            let user = await User.findOne({ email });
            if (!user) {
                console.log('entry');
                user = new User({
                    username: profile.name.givenName,
                    email: profile.emails[0].value,
                });
                await user.save();
            }
            return done(null, user);
        } catch (error) {
            return done(error, false)
        }
    }
))
passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, false);
    }
});