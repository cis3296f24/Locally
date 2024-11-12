export const calculateRegion = (
    userLatitude: number,
    userLongitude: number,
    destLatitude: number,
    destLongitude: number
) => {
    const latitudeDelta = Math.abs(destLatitude - userLatitude) * 2;
    const longitudeDelta = Math.abs(destLongitude - userLongitude) * 2;

    return {
        latitude: (userLatitude + destLatitude) / 2,
        longitude: (userLongitude + destLongitude) / 2,
        latitudeDelta: latitudeDelta > 0.06 ? latitudeDelta : 0.06,
        longitudeDelta: longitudeDelta > 0.06 ? longitudeDelta : 0.06,
    };
};