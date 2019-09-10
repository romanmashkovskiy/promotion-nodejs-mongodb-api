import * as AWS from 'aws-sdk';
import env from '../config/env';

AWS.config.update({
    accessKeyId: env.AWS_KEY,
    secretAccessKey: env.AWS_SECRET,
    region: env.AWS_REGION
});
const s3 = new AWS.S3();
const ses = new AWS.SES();

export const s3UploadBase64 = (key, picture) => new Promise((resolve, reject) => {
    const buf = Buffer.from(picture.base64.replace(/^data:image\/\w+;base64,/, ''), 'base64');
    new AWS.S3().putObject({
        Bucket: env.AWS_BUCKET,
        Key: key,
        Body: buf,
        ContentEncoding: 'base64',
        ContentType: 'image/*',
        ACL: 'public-read'
    }, (error, data) => {
        if (error) {
            reject(error);
        } else {
            resolve({
                s3Key: key,
                url: `https://s3.${ env.AWS_REGION }.amazonaws.com/${ env.AWS_BUCKET }/${ key }`,
                name: picture.name
            });
        }
    });
});

export const s3RemoveFile = (key) => new Promise((resolve, reject) => {
    s3.deleteObject({
        Bucket: env.AWS_BUCKET,
        Key: key
    }, (error, data) => {
        if (error) {
            reject(error);
        } else {
            resolve(data);
        }
    });
});

export const sesSendEmail = (to, from, subject, text, html = null) => new Promise((resolve, reject) => {
    const params = {
        Source: from,
        Destination: {
            ToAddresses: [to]
        },
        Message: {
            Subject: {
                Data: subject,
                Charset: 'UTF-8'
            },
            Body: {
                Text: {
                    Data: text,
                    Charset: 'UTF-8'
                },
                Html: {
                    // HTML Format of the email
                    Data: html || text,
                    Charset: 'UTF-8'
                }

            }
        },
    };

    new AWS.SES({ apiVersion: '2010-12-01', region: 'us-east-1' }).sendEmail(params, (err, data) => {
        if (err) {
            reject(err);
        }
        else {
            resolve(data);
        }
    });
});