import { v2 as cloudinary } from 'cloudinary';
import 'dotenv/config';
import fs from 'fs';

// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDNARIY_NAME,
    api_key: process.env.CLOUDNARIY_API_KEY,
    api_secret: process.env.CLOUDNARIY_SECREATE // Click 'View API Keys' above to copy your API secret
});

// Upload an image
async function handleFileUploading(localfilepath) {
    try {
        if (localfilepath) {
            const uploadResult = await cloudinary.uploader.upload(localfilepath, { resource_type: 'auto' });
            fs.unlinkSync(localfilepath);
            return uploadResult.url;
        }
    } catch (error) {
        fs.unlinkSync(localfilepath); // Remove Saved Temporary file when operation get faild
        return null;
    }
}

export default handleFileUploading;