import passport from 'passport';
import local from 'passport-local';
import GitHubStrategy from 'passport-github2';
import User from '../dao/mongoDB/models/user.models.js';
import { createHash, isValidPassword } from '../utils/passwordEncryptor.js';
import config from './index.js';

const { clientID, clientSecret } = config.github;

const LocalStrategy = local.Strategy;

const initializePassport = () => {
    passport.use('register', new LocalStrategy(
        {passReqToCallback: true, usernameField: 'email'}, async (req, username, password, done) => {
            const { first_name, last_name, age, email } = req.body;

            try {
                const user = await User.findOne({email: username});

                if(user) return done(null, false);

                const newUserInfo = {
                    first_name,
                    last_name,
                    age,
                    email,
                    password: createHash(password)
                }
                const newUser = await User.create(newUserInfo);
                return done(null, newUser);
            } catch (error) {
                return done(error);
            }
        }
    ));

    passport.use('github', new GitHubStrategy({
        clientID: clientID,
        clientSecret: clientSecret,
        callbackURL: 'http://localhost:3000/api/auth/githubCallback'
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            console.log(profile);
            const user = await User.findOne({email: profile._json.email});
            if(user) return done(null, user);
            const newUserInfo = {
                first_name: profile._json.name,
                last_name: '',
                age: 18,
                email: profile._json.email,
                password: ''
            }
            const newUSer = User.create(newUserInfo);
            done(null, newUSer);
        } catch (error) {
            return done(error)
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        const user = await User.findById(id);
        done(null, user)
    });

    passport.use('login', new LocalStrategy({usernameField: 'email'}, async (username, password, done) => {
        try {
            const user = await User.findOne({email: username});
            if(!user) {
                console.log('No existe el usuario');
                return done(null, false);
            }
            if(!isValidPassword(user, password)) return done(null, false);
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }))
}

export default initializePassport;