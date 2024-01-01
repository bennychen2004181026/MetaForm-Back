type EnvType = 'development' | 'test' | 'production';

const {
    NODE_ENV,
    APP_URL_LOCAL,
    APP_URL_TEST,
    APP_URL_PRODUCTION,
    API_URL_LOCAL,
    API_URL_TEST,
    API_URL_PRODUCTION,
} = process.env;

const appURLs: Record<EnvType, string | undefined> = {
    development: APP_URL_LOCAL,
    test: APP_URL_TEST,
    production: APP_URL_PRODUCTION,
};

const apiURLs: Record<EnvType, string | undefined> = {
    development: API_URL_LOCAL,
    test: API_URL_TEST,
    production: API_URL_PRODUCTION,
};

const env: EnvType = (NODE_ENV as EnvType) in apiURLs ? (NODE_ENV as EnvType) : 'development';

export const currentApiUrl = apiURLs[env];
export const currentAppUrl = appURLs[env];
