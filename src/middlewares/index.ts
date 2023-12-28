import errorHandler from '@middleware/errorHandler';
import alreadyLogin from '@middleware/alreadyLogin';
import googleOauthErrorHandler from '@middleware/googleOauthErrorHandler';

const middlewares = {
    errorHandler,
    alreadyLogin,
    googleOauthErrorHandler,
};

export default middlewares;
