import errorHandler from '@middleware/errorHandler';
import alreadyLogin from '@middleware/alreadyLogin';

const middlewares = {
    errorHandler,
    alreadyLogin,
};

export default middlewares;
