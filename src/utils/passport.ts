import passport from 'passport';
import passportGoogle, { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '@models/user.model';
import { IUser, PassportUser, Role } from '@interfaces/users';
import { EnvType } from '@interfaces/utils';

const clientID = process.env.GOOGLE_CLIENT_ID ?? '';
const clientSecret = process.env.GOOGLE_CLIENT_SECRET ?? '';

const { NODE_ENV, API_URL_LOCAL, API_URL_TEST, API_URL_PRODUCTION } = process.env;

const apiURLs: Record<EnvType, string | undefined> = {
    development: API_URL_LOCAL,
    test: API_URL_TEST,
    production: API_URL_PRODUCTION,
};

const env: EnvType = (NODE_ENV as EnvType) in apiURLs ? (NODE_ENV as EnvType) : 'development';

const callbackURL = `${apiURLs[env]}/users/auth/google/callback`;

const options = {
    clientID,
    clientSecret,
    callbackURL,
};

passport.use(
    new GoogleStrategy(
        options,
        async (
            _accessToken: string,
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
                            role: Role.SuperAdmin,
                            isAccountComplete: false,
                            isActive: true,
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
