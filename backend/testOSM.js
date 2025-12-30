import { getCoordinates } from './services/googleMapsService.js';

console.log("--- TESTING OPENSTREETMAP ---");

async function test() {
    const address = "Hồ Hoàn Kiếm, Hà Nội";
    console.log(`Searching for: "${address}"...`);

    const result = await getCoordinates(address);
    
    console.log("\nResult:");
    console.log(result);

    if (result.address.includes("Fallback")) {
        console.log("\n⚠️ USING FALLBACK (Something failed)");
    } else {
        console.log("\n✅ SUCCESS! Coordinates received from OSM.");
    }
}

test();
