import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Paths
const FRONTEND_ASSETS_PATH = path.join(__dirname, '..', '..', 'frontend', 'src', 'assets');
const BACKEND_UPLOADS_PATH = path.join(__dirname, '..', 'uploads');
const OUTPUT_FILE = path.join(__dirname, 'cloudinary-urls.json');

// Image extensions to upload
const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp', '.svg', '.gif'];

async function uploadFile(filePath, folder) {
    const fileName = path.basename(filePath, path.extname(filePath));
    const publicId = `${folder}/${fileName}`;

    try {
        const result = await cloudinary.uploader.upload(filePath, {
            public_id: publicId,
            resource_type: 'auto',
            overwrite: true
        });
        console.log(`✅ Uploaded: ${path.basename(filePath)} -> ${result.secure_url}`);
        return { name: path.basename(filePath), url: result.secure_url };
    } catch (error) {
        console.error(`❌ Failed: ${path.basename(filePath)} - ${error.message}`);
        return null;
    }
}

async function uploadDirectory(dirPath, cloudinaryFolder) {
    const results = [];

    if (!fs.existsSync(dirPath)) {
        console.log(`⚠️ Directory not found: ${dirPath}`);
        return results;
    }

    const files = fs.readdirSync(dirPath);

    for (const file of files) {
        const filePath = path.join(dirPath, file);
        const ext = path.extname(file).toLowerCase();

        if (fs.statSync(filePath).isFile() && IMAGE_EXTENSIONS.includes(ext)) {
            const result = await uploadFile(filePath, cloudinaryFolder);
            if (result) {
                results.push(result);
            }
            // Small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 200));
        }
    }

    return results;
}

async function main() {
    console.log('🚀 Starting Cloudinary Migration...\n');
    console.log(`Cloud Name: ${process.env.CLOUDINARY_NAME}`);
    console.log(`Frontend Assets: ${FRONTEND_ASSETS_PATH}`);
    console.log(`Backend Uploads: ${BACKEND_UPLOADS_PATH}\n`);

    const urlMapping = {
        assets: {},
        uploads: {}
    };

    // Upload frontend assets
    console.log('📁 Uploading Frontend Assets...');
    const assetResults = await uploadDirectory(FRONTEND_ASSETS_PATH, 'bkfood/assets');
    assetResults.forEach(r => {
        urlMapping.assets[r.name] = r.url;
    });
    console.log(`\n✅ Uploaded ${assetResults.length} frontend assets\n`);

    // Upload backend uploads
    console.log('📁 Uploading Backend Uploads...');
    const uploadResults = await uploadDirectory(BACKEND_UPLOADS_PATH, 'bkfood/uploads');
    uploadResults.forEach(r => {
        urlMapping.uploads[r.name] = r.url;
    });
    console.log(`\n✅ Uploaded ${uploadResults.length} backend uploads\n`);

    // Save URL mapping
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(urlMapping, null, 2));
    console.log(`📄 URL mapping saved to: ${OUTPUT_FILE}`);

    console.log('\n🎉 Migration Complete!');
    console.log(`Total images uploaded: ${assetResults.length + uploadResults.length}`);
}

main().catch(console.error);
