

function getGridID(latitude, longitude) {
    if (latitude == null || longitude == null) return null;
    const KM_PER_DEGREE_LAT = 111;
    const GRID_SIZE_KM = 3;
    
    // Convert latitude to km
    const kmLat = KM_PER_DEGREE_LAT * latitude;
    
    // Convert longitude to km (adjust for latitude)
    const kmLong = KM_PER_DEGREE_LAT * Math.cos(latitude * Math.PI / 180) * longitude;
    
    // Determine grid coordinates
    const gridX = Math.floor(kmLat / GRID_SIZE_KM);
    const gridY = Math.floor(kmLong / GRID_SIZE_KM);
    
    return { gridX, gridY };
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in km
    const toRadians = (degrees) => degrees * (Math.PI / 180);

    const dlat = toRadians(lat2 - lat1);
    const dlon = toRadians(lon2 - lon1);

    const a = Math.sin(dlat / 2) ** 2 + 
              Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * 
              Math.sin(dlon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    return R * c;
}

function shuffleArray(array) {
    const shuffled = array.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

export { getGridID, calculateDistance, shuffleArray };