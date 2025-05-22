// config/passport.js
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';

const configurePassport = (passport) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:5000/api/auth/google/callback'
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails[0].value;
          const existingUser = await User.findOne({ email });

          if (existingUser) {
            return done(null, existingUser);
          }

          const newUser = await User.create({
            name: profile.displayName,
            email: email,
            password: 'google', // not used
            isVerified: true
          });

          return done(null, newUser);
        } catch (error) {
          console.error('Google Auth Error:', error);
          return done(error, null);
        }
      }
    )
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
  });
};

export default configurePassport;
