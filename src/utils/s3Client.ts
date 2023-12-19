import { S3Client, S3ClientConfig } from '@aws-sdk/client-s3';
import Errors from '@errors/ClassError';

const { AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = process.env;

if (!AWS_REGION || !AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
    throw new Errors.EnvironmentError(
        'AWS configuration not set in environment variables',
        'env variables',
    );
}

const s3ClientConfig: S3ClientConfig = {
    region: AWS_REGION,
    credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID || '',
        secretAccessKey: AWS_SECRET_ACCESS_KEY || '',
    },
};

const s3Client = new S3Client(s3ClientConfig);

export default s3Client;
