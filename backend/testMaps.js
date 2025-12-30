import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env explicitly from backend directory
dotenv.config({ path: path.join(__dirname, '.env') });

const key = process.env.GOOGLE_MAPS_API_KEY;

console.log("--- GOOGLE MAPS API TEST ---");
console.log("Key Status:", key ? "✅ Loaded" : "❌ Missing in .env");

if (!key) {
    process.exit(1);
}

// Địa chỉ test: Phố đi bộ Hồ Gươm
const address = "Hồ Hoàn Kiếm, Hà Nội";
const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${key}`;

console.log(`Testing address: "${address}"...`);

async function test() {
    try {
        const response = await axios.get(url);
        const data = response.data;

        if (data.status === 'OK') {
            console.log("\n✅ SUCCESS! API is working.");
            console.log("Formatted Address:", data.results[0].formatted_address);
            console.log("Coordinates:", data.results[0].geometry.location);
        } else {
            console.log("\n❌ FAILED. Google responded with error:");
            console.log("Status:", data.status);
            console.log("Error Message:", data.error_message || "No detail provided");
            
            if (data.status === 'REQUEST_DENIED') {
                console.log("\n👉 Gợi ý sửa lỗi:");
                console.log("1. Kiểm tra xem đã bật 'Billing' (Thanh toán) trên Google Cloud Console chưa.");
                console.log("2. Đảm bảo API 'Geocoding API' đã được Enable.");
                console.log("3. Kiểm tra xem Key có bị giới hạn IP không (Application restrictions).");
            }
        }
    } catch (error) {
        console.error("\n❌ NETWORK ERROR:", error.message);
    }
}

test();
