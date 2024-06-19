export const GRID_SIZE_KM = 3;



export function getGridID(latitude: number, longitude: number): { gridX: number, gridY: number } {
    const KM_PER_DEGREE_LAT = 111;

    // Convert latitude to km
    const kmLat = KM_PER_DEGREE_LAT * latitude;

    // Convert longitude to km (adjust for latitude)
    const kmLong = KM_PER_DEGREE_LAT * Math.cos(latitude * Math.PI / 180) * longitude;

    // Determine grid coordinates
    const gridX = Math.floor(kmLat / GRID_SIZE_KM);
    const gridY = Math.floor(kmLong / GRID_SIZE_KM);

    return { gridX, gridY };
}

export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the Earth in km
    const toRadians = (degrees: number) => degrees * (Math.PI / 180);

    const dlat = toRadians(lat2 - lat1);
    const dlon = toRadians(lon2 - lon1);

    const a = Math.sin(dlat / 2) ** 2 + 
              Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * 
              Math.sin(dlon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

export function shuffleArray<T>(array: T[]): T[] {
    const shuffled = array.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

export function convertTime2Num(time: string): number {
    const [hour, minute] = time.split(':').map(Number);
    return hour + minute / 60;
}

export function getDay(): number {
    let date = new Date();
    return date.getDay();
}

export function getTimeNumber(): number {
    let date = new Date();
    return date.getHours() + date.getMinutes() / 60;
}

export function extractPlaceID(url: string): string {
    const parts = url.split('/');
    return parts[parts.length - 1];
}