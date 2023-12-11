import passport from 'passport';
import passportGoogle, { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '@models/user.model';
import { IUser, PassportUser } from '@interfaces/users';

const clientID = process.env.GOOGLE_CLIENT_ID || '';
const clientSecret = process.env.GOOGLE_CLIENT_SECRET || '';
const PORT = process.env.PORT || '3001';
const { NODE_ENV } = process.env;

let callbackURL: string;
if (NODE_ENV === 'production') {
    callbackURL = `http://localhost:${PORT}/users/auth/google/callback`;
} else if (NODE_ENV === 'test') {
    callbackURL = `http://localhost:${PORT}/users/auth/google/callback`;
} else {
    callbackURL = `http://localhost:${PORT}/users/auth/google/callback`;
}

const options = {
    clientID,
    clientSecret,
    callbackURL,
};

passport.use(
    new GoogleStrategy(
        options,
        async (
            accessToken: string,
            refreshToken: string,
            profile: passportGoogle.Profile,
            done: (error: Error | null, user?: IUser | undefined) => void,
        ) => {
            try {
                const email: string | undefined = profile.emails?.[0]?.value;

                if (email) {
                    let user: IUser | null = await User.findOne({ email });

                    if (!user) {
                        user = new User({
                            email,
                            username: 'GoogleUser',
                            firstName: profile.name?.givenName,
                            lastName: profile.name?.familyName,
                            role: 'super_admin',
                            isAccountComplete: false,
                            isActive: false,
                            googleRefreshToken: refreshToken,
                        });
                        await user.save();
                    }
                    done(null, user);
                } else {
                    done(new Error('Email not available from Google profile'));
                }
            } catch (error) {
                done(error as Error);
            }
        },
    ),
);

passport.serializeUser((user: PassportUser, done): void => {
    done(null, user._id);
});

passport.deserializeUser(async (id: string | null | undefined, done): Promise<void> => {
    try {
        const user: IUser | null | undefined = await User.findById(id);
        done(null, user);
    } catch (error: unknown) {
        done(error);
    }
});

export default passport;
