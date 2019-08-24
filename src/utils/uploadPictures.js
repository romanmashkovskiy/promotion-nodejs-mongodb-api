import { s3UploadFile } from './aws';
import fs from 'fs';
import env from '../config/env';

export default (file, photos, uploadedDocuments) => new Promise(async (resolve, reject) => {
    try {
        const s3Key = file.filename + '.' + file.originalname.split('.').pop();

        await s3UploadFile(s3Key, fs.readFileSync(file.path));

        let document = {
            s3Key: s3Key,
            url: env.MEDIA_DOMAIN + '/' + s3Key,
            name: file.originalname,

        };
        uploadedDocuments.push(document);
        let index = photos.findIndex(doc => doc.name === file.originalname && !doc.s3Key);
        photos[index] = { ...photos[index], ...document };
        fs.unlinkSync(file.path);
        resolve(uploadedDocuments);
    } catch (error) {
        fs.unlinkSync(file.path);
        reject(error);
    }
})