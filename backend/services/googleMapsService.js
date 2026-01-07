import axios from 'axios';


export const getCoordinates = async (address) => {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`;

    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'FoodDeliveryStudentProject/1.0',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7'
            }
        });

        if (response.data && response.data.length > 0) {
            const result = response.data[0];
            return {
                lat: result.lat,
                lng: result.lon, // Nominatim returns 'lon', Driver API needs 'lng'
                address: result.display_name
            };
        } else {
            console.warn(`[OSM Warning] Address not found: "${address}". Using fallback.`);
            return useFallback("Address not found on OSM");
        }
    } catch (error) {
        console.error("OSM Error:", error.message);
        return useFallback(`Network Error: ${error.message}`);
    }
};

const useFallback = (reason) => {
    return {
        lat: "21.028511", // Hà Nội
        lng: "105.804817",
        address: "Hanoi, Vietnam (Fallback)"
    };
};